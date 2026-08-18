import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { toast } from "sonner";
import {
  api,
  buildReceiveUrl,
  downloadFromUrl,
  resolveFileMime,
  uploadFile,
  EXPIRY_OPTIONS,
} from "../../api/client.js";
import { ShareOptionsBar } from "../ui/ShareResultCard.jsx";
import PortalSuccess from "../ui/PortalSuccess.jsx";
import { GlassCard, LiveBadge } from "../ui/Primitives.jsx";
import QrCodeScanner from "../QrCodeScanner/QrCodeScanner.jsx";
import "./ShareWorkspace.css";

const typeLabel = {
  text: "Text",
  image: "Image",
  file: "File",
  audio: "Audio",
};

const workspaceCopy = {
  text: {
    heading: "Share text",
    sub: "Write or paste content, then create a portal.",
    action: "Create portal",
    receive: "Enter a code or scan QR to receive.",
  },
  image: {
    heading: "Share image",
    sub: "Upload an image, then create a portal.",
    action: "Create portal",
    receive: "Enter a code or scan QR to receive.",
  },
  file: {
    heading: "Share file",
    sub: "Upload a file, then create a portal.",
    action: "Create portal",
    receive: "Enter a code or scan QR to receive.",
  },
  audio: {
    heading: "Share audio",
    sub: "Upload audio, then create a portal.",
    action: "Create portal",
    receive: "Enter a code or scan QR to receive.",
  },
};

const formatBytes = (n) => {
  if (!n && n !== 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const formatExpiry = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return null;
  }
};

const storageKey = (type) => `mv_ws_v1_${type}`;

const readStore = (type) => {
  try {
    const raw = sessionStorage.getItem(storageKey(type));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.type !== type) return null;
    return data;
  } catch {
    return null;
  }
};

const writeStore = (type, patch) => {
  try {
    const prev = readStore(type) || { type };
    const next = { ...prev, ...patch, type };
    sessionStorage.setItem(storageKey(type), JSON.stringify(next));
  } catch {
    /* ignore */
  }
};

const clearStore = (type) => {
  try {
    sessionStorage.removeItem(storageKey(type));
    sessionStorage.removeItem(`mv_portal_result_${type}`);
  } catch {
    /* ignore */
  }
};

const MediaResult = ({ share }) => {
  const blob = share?.blob;
  const [downloading, setDownloading] = useState(false);
  if (!share) return null;

  if (share.type === "text") {
    return (
      <div className="sw_media_result">
        <div className="sw_media_meta">
          <span className="sw_received_type">TEXT · #{share.shareId}</span>
          {share.expiresAt ? (
            <span className="sw_media_expiry">Expires {formatExpiry(share.expiresAt)}</span>
          ) : null}
        </div>
        <pre className="sw_received_text">{share.content}</pre>
        <div className="sw_media_actions">
          <button
            type="button"
            className="mv_btn mv_btn--primary"
            onClick={async () => {
              await navigator.clipboard.writeText(share.content || "");
              toast.success("Copied");
            }}
          >
            Copy text
          </button>
        </div>
      </div>
    );
  }

  if (!blob?.url) {
    return (
      <div className="sw_media_result">
        <span className="sw_received_type">
          {share.type?.toUpperCase()} · #{share.shareId}
        </span>
        <p className="sw_panel_sub">No media attached.</p>
      </div>
    );
  }

  const filename = blob.filename || "download";
  const onDownload = async () => {
    setDownloading(true);
    try {
      const ok = await downloadFromUrl(blob.url, filename);
      toast.success(ok ? "Download started" : "Opened in new tab");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="sw_media_result">
      <div className="sw_media_meta">
        <span className="sw_received_type">
          {share.type?.toUpperCase()} · #{share.shareId}
        </span>
        <LiveBadge label="LIVE" />
      </div>
      {share.type === "image" ? (
        <img src={blob.url} alt={filename} className="sw_preview sw_preview--receive" />
      ) : null}
      {share.type === "audio" ? <audio controls src={blob.url} className="sw_audio" /> : null}
      {share.type === "file" ? (
        <div className="sw_file_chip">
          <strong>{filename}</strong>
          <span>
            {blob.mimeType || "file"}
            {blob.size ? ` · ${formatBytes(blob.size)}` : ""}
          </span>
        </div>
      ) : null}
      <div className="sw_media_actions">
        <button
          type="button"
          className="mv_btn mv_btn--primary"
          disabled={downloading}
          onClick={onDownload}
        >
          {downloading ? "Preparing…" : "Download"}
        </button>
        {share.type === "image" || share.type === "file" ? (
          <a className="mv_btn mv_btn--ghost" href={blob.url} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : null}
      </div>
    </div>
  );
};

const ShareWorkspace = ({
  initialType = "text",
  fixedType,
  initialCode = "",
  initialMode,
  embedded = false,
  onModeChange,
  onReceiveNavigate,
}) => {
  const type = fixedType || initialType;
  const copy = workspaceCopy[type] || workspaceCopy.text;
  const boot = (() => {
    const saved = readStore(type);
    const legacy = (() => {
      try {
        const raw = sessionStorage.getItem(`mv_portal_result_${type}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.shareId && parsed?.type === type ? parsed : null;
      } catch {
        return null;
      }
    })();
    return {
      mode:
        initialMode === "share" || initialMode === "receive"
          ? initialMode
          : saved?.mode || (initialCode ? "receive" : "share"),
      text: type === "text" && typeof saved?.text === "string" ? saved.text : "",
      privacy: saved?.privacy === "incognito" ? "incognito" : "public",
      expiresInMs:
        typeof saved?.expiresInMs === "number"
          ? saved.expiresInMs
          : EXPIRY_OPTIONS[1].value,
      result:
        saved?.result?.shareId && saved.result.type === type
          ? saved.result
          : legacy,
      code: initialCode || (saved?.code && typeof saved.code === "string" ? saved.code : ""),
      received:
        saved?.received?.shareId && saved.received.type === type
          ? saved.received
          : null,
    };
  })();

  const [mode, setMode] = useState(boot.mode);
  const [text, setText] = useState(boot.text);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [privacy, setPrivacy] = useState(boot.privacy);
  const [expiresInMs, setExpiresInMs] = useState(boot.expiresInMs);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState(boot.result);
  const [code, setCode] = useState(boot.code);
  const [received, setReceived] = useState(boot.received);
  const [scannerOpen, setScannerOpen] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialMode === "share" || initialMode === "receive") setMode(initialMode);
  }, [initialMode]);

  // Persist only this section's isolated workspace data
  useEffect(() => {
    writeStore(type, {
      mode,
      text: type === "text" ? text : "",
      privacy,
      expiresInMs,
      result: result?.shareId && result.type === type ? result : null,
      code,
      received: received?.shareId && received.type === type ? received : null,
    });
  }, [type, mode, text, privacy, expiresInMs, result, code, received]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (initialCode) {
      setMode("receive");
      setCode(initialCode);
      fetchShare(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, type]);

  const switchMode = (next) => {
    setMode(next);
    onModeChange?.(next);
    // Keep this section's share result across Share ↔ Receive until New portal
    if (next === "share") setReceived(null);
  };

  const acceptForType = () => {
    if (type === "image") return "image/*";
    if (type === "audio") return "audio/*";
    return "*/*";
  };

  const pickFile = (f) => {
    if (!f) return;
    const mime = resolveFileMime(f);
    if (type === "image" && !mime.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (type === "audio" && !mime.startsWith("audio/")) {
      toast.error("Please choose an audio file");
      return;
    }
    const normalized =
      !f.type || f.type === "application/octet-stream"
        ? new File([f], f.name, { type: mime, lastModified: f.lastModified })
        : f;
    setFile(normalized);
  };

  const resetCompose = () => {
    setResult(null);
    setReceived(null);
    setText("");
    setFile(null);
    setCode("");
    setPrivacy("public");
    setExpiresInMs(EXPIRY_OPTIONS[1].value);
    setScannerOpen(false);
    clearStore(type);
  };

  const createShare = async () => {
    setLoading(true);
    try {
      const payload = {
        type,
        privacy,
        expiresInMs,
        title: `${typeLabel[type]} Multiverse`,
      };

      if (type === "text") {
        if (!text.trim()) {
          toast.error("Enter some text to share");
          setLoading(false);
          return;
        }
        payload.text = text.trim();
      } else {
        if (!file) {
          toast.error(`Choose a ${type} to share`);
          setLoading(false);
          return;
        }
        payload.blob = await uploadFile(file);
      }

      const { ok, status, data } = await api.createShare(payload);
      if (!ok) {
        toast.error(data?.msg || data?.message || `Share failed (${status})`);
        setLoading(false);
        return;
      }

      const shareId = data.shareId || data.data?.shareId;
      const createdType = data.type || data.data?.type || type;
      if (createdType !== type) {
        toast.error(`Created share type mismatch (expected ${typeLabel[type]})`);
        setLoading(false);
        return;
      }
      setReceived(null);
      setResult({
        shareId,
        url: buildReceiveUrl(shareId, type),
        expiresAt: data.expiresAt || data.data?.expiresAt,
        privacy: data.privacy || privacy,
        type,
      });
      toast.success("Portal opened");
    } catch (error) {
      toast.error(error?.message || "Could not create share");
    } finally {
      setLoading(false);
    }
  };

  const assertSectionType = (shareType) => {
    if (!shareType || shareType === type) return true;
    toast.error(
      `This code is a ${typeLabel[shareType] || shareType} portal. Open the ${typeLabel[shareType] || shareType} section to receive it.`
    );
    return false;
  };

  const fetchShare = async (shareId) => {
    const id = String(shareId || code || "").trim();
    if (!id) {
      toast.error("Enter a Multiverse code");
      return;
    }
    setLoading(true);
    try {
      const statusRes = await api.getShareStatus(id);
      if (statusRes.ok && statusRes.data?.data) {
        const st = statusRes.data.data;
        if (!st.exists) {
          toast.error("Share not found");
          setLoading(false);
          return;
        }
        if (st.expired) {
          toast.error("This portal has expired");
          setLoading(false);
          return;
        }
        if (st.consumed) {
          toast.error("Incognito share already consumed");
          setLoading(false);
          return;
        }
        if (!assertSectionType(st.type)) {
          setReceived(null);
          setLoading(false);
          return;
        }
      }

      const { ok, status, data } = await api.getShare(id);
      if (!ok) {
        toast.error(
          status === 410
            ? data?.msg || data?.message || "Share gone"
            : data?.msg || data?.message || "Could not open share"
        );
        setLoading(false);
        return;
      }

      const payload = data.data || data;
      if (!assertSectionType(payload?.type)) {
        setReceived(null);
        setLoading(false);
        return;
      }

      setReceived({ ...payload, type });
      toast.success("Portal opened");
    } catch {
      toast.error("Failed to fetch share");
    } finally {
      setLoading(false);
    }
  };

  const pathTypeFromUrl = (url) => {
    try {
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) =>
        ["text", "image", "file", "audio"].includes(p)
      );
      return idx >= 0 ? parts[idx] : null;
    } catch {
      return null;
    }
  };

  const onScan = (raw) => {
    setScannerOpen(false);
    const value = String(raw || "").trim();
    if (!value) return;

    try {
      const url = new URL(value);
      const pathType = pathTypeFromUrl(url);
      if (pathType && pathType !== type) {
        toast.error(
          `This QR opens a ${typeLabel[pathType]} portal. Switch to ${typeLabel[pathType]} first.`
        );
        return;
      }
      const fromQuery =
        url.searchParams.get("multiversecode") ||
        url.searchParams.get("code") ||
        url.searchParams.get("id");
      const parts = url.pathname.split("/").filter(Boolean);
      const typeIdx = parts.findIndex((p) =>
        ["text", "image", "file", "audio"].includes(p)
      );
      const fromPath =
        typeIdx >= 0 && parts[typeIdx + 1]
          ? decodeURIComponent(parts[typeIdx + 1])
          : "";
      const scannedCode = fromQuery || fromPath;
      if (scannedCode) {
        setCode(scannedCode);
        fetchShare(scannedCode);
        return;
      }
    } catch {
      /* plain code or path */
    }

    const match = value.match(/multiversecode=([^&#]+)/i);
    if (match?.[1]) {
      const codeFromLink = decodeURIComponent(match[1]);
      setCode(codeFromLink);
      fetchShare(codeFromLink);
      return;
    }

    const maybe = value.replace(/^#/, "").split("/").pop();
    setCode(maybe);
    fetchShare(maybe);
  };

  const dropHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e) => {
      e.preventDefault();
      setDragOver(false);
      pickFile(e.dataTransfer.files?.[0]);
    },
  };

  return (
    <div className={`sw sw--solo sw--${type} ${embedded ? "sw--embedded" : ""}`}>
      <div className="sw_tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "share"}
          className={mode === "share" ? "is-active" : ""}
          onClick={() => switchMode("share")}
        >
          Share
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "receive"}
          className={mode === "receive" ? "is-active" : ""}
          onClick={() => switchMode("receive")}
        >
          Receive
        </button>
      </div>

      <AnimatePresence mode="wait">
        <Motion.div
          className="sw_stage"
          key={`${type}-${mode}-${result?.shareId && result.type === type ? "ok" : "form"}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {mode === "share" && result?.shareId && result.type === type ? (
            <PortalSuccess
              {...result}
              onNewPortal={resetCompose}
              onOpenReceive={() => {
                if (onReceiveNavigate) onReceiveNavigate(result.shareId);
                else {
                  setCode(result.shareId);
                  switchMode("receive");
                  fetchShare(result.shareId);
                }
              }}
            />
          ) : null}

          {mode === "share" && !(result?.shareId && result.type === type) ? (
            <GlassCard className="sw_panel ws_board">
              <div className="sw_panel_head">
                <div>
                  <h3>{copy.heading}</h3>
                  <p className="sw_panel_sub">{copy.sub}</p>
                </div>
                <LiveBadge />
              </div>

              {type === "text" ? (
                <textarea
                  className="sw_textarea"
                  rows={8}
                  placeholder="Write anything to share…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              ) : (
                <div
                  className={`sw_dropzone ${dragOver ? "is-drag" : ""} ${file ? "has-file" : ""}`}
                  {...dropHandlers}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept={acceptForType()}
                    hidden
                    onChange={(e) => pickFile(e.target.files?.[0] || null)}
                  />
                  {!file ? (
                    <button
                      type="button"
                      className="sw_dropzone_btn"
                      onClick={() => fileRef.current?.click()}
                    >
                      <span className="sw_dropzone_glyph">⇪</span>
                      <strong>Drop or choose {type}</strong>
                      <span>
                        {type === "image"
                          ? "PNG, JPG, WEBP…"
                          : type === "audio"
                            ? "MP3, WAV, M4A…"
                            : "PDF, ZIP, DOC…"}
                      </span>
                    </button>
                  ) : (
                    <div className="sw_file_card">
                      {type === "image" && previewUrl ? (
                        <img src={previewUrl} alt="preview" className="sw_preview" />
                      ) : null}
                      {type === "audio" && previewUrl ? (
                        <audio controls src={previewUrl} className="sw_audio" />
                      ) : null}
                      <div className="sw_file_meta">
                        <strong>{file.name}</strong>
                        <span>{formatBytes(file.size)}</span>
                      </div>
                      <div className="sw_file_actions">
                        <button
                          type="button"
                          className="mv_btn mv_btn--ghost"
                          onClick={() => fileRef.current?.click()}
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          className="mv_btn mv_btn--ghost"
                          onClick={() => setFile(null)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <ShareOptionsBar
                privacy={privacy}
                setPrivacy={setPrivacy}
                expiresInMs={expiresInMs}
                setExpiresInMs={setExpiresInMs}
                options={EXPIRY_OPTIONS}
              />

              <button
                type="button"
                className="mv_btn mv_btn--primary sw_cta"
                disabled={loading}
                onClick={createShare}
              >
                {loading ? "Creating…" : copy.action}
              </button>
            </GlassCard>
          ) : null}

          {mode === "receive" ? (
            <GlassCard className="sw_panel ws_board">
              <div className="sw_panel_head">
                <div>
                  <h3>Receive</h3>
                  <p className="sw_panel_sub">{copy.receive}</p>
                </div>
                <LiveBadge label="SCAN" />
              </div>

              {result?.shareId && result.type === type ? (
                <div className="sw_active_portal">
                  <div>
                    <strong>Active portal saved</strong>
                    <span>#{result.shareId} — kept until reload or New portal</span>
                  </div>
                  <div className="sw_active_portal_actions">
                    <button
                      type="button"
                      className="mv_btn mv_btn--ghost"
                      onClick={() => switchMode("share")}
                    >
                      View portal
                    </button>
                    <button
                      type="button"
                      className="mv_btn mv_btn--primary"
                      onClick={() => {
                        resetCompose();
                        switchMode("share");
                      }}
                    >
                      New portal
                    </button>
                  </div>
                </div>
              ) : null}

              <label className="sw_code_label">
                Multiverse code
                <input
                  className="sw_code_input"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  placeholder="e.g. AB12X9…"
                  onKeyDown={(e) => e.key === "Enter" && fetchShare()}
                />
              </label>

              <div className="sw_receive_actions">
                <button
                  type="button"
                  className="mv_btn mv_btn--primary"
                  disabled={loading}
                  onClick={() => fetchShare()}
                >
                  {loading ? "Opening…" : "Open portal"}
                </button>
                <button
                  type="button"
                  className="mv_btn mv_btn--ghost"
                  onClick={() => setScannerOpen(true)}
                >
                  Scan QR
                </button>
              </div>

              {scannerOpen ? (
                <div className="sw_scanner">
                  <QrCodeScanner
                    openScanner={({ action, url }) => {
                      if (!action) {
                        setScannerOpen(false);
                        if (url) onScan(url);
                      }
                    }}
                  />
                </div>
              ) : null}

              {received?.shareId && received.type === type ? (
                <MediaResult share={received} />
              ) : null}
            </GlassCard>
          ) : null}
        </Motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ShareWorkspace;
