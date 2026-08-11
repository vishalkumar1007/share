import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { GlassCard, LiveBadge } from "./Primitives";
import "./ui.css";

const formatRemaining = (ms) => {
  if (ms <= 0) return "Expired";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const shortUrl = (url) => {
  try {
    const u = new URL(url);
    const code = u.searchParams.get("multiversecode");
    if (code) return `multiverse.v/${code}`;
    return u.host + u.pathname;
  } catch {
    return url;
  }
};

export const ShareResultCard = ({
  type = "text",
  shareId,
  url,
  expiresAt,
  privacy = "public",
  title = "",
  showFloatChips = true,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    if (!expiresAt) return null;
    return new Date(expiresAt).getTime() - now;
  }, [expiresAt, now]);

  const live = remaining == null || remaining > 0;
  const displayTitle =
    title ||
    ({
      text: "Text Multiverse",
      image: "Image Multiverse",
      file: "File Multiverse",
      audio: "Audio Multiverse",
    }[type] || "Multiverse Share");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { style: { color: "#19b030d0" } });
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="mv_result_stage">
      {showFloatChips ? (
        <>
          <span className="mv_result_float mv_result_float--1">
            <span className="mv_result_float_dot" />
            Link created
          </span>
          <span className="mv_result_float mv_result_float--2">
            <span className="mv_result_float_dot" />
            Scan to receive
          </span>
        </>
      ) : null}

      <GlassCard className="mv_result">
        <div className="mv_result_top">
          <div className="mv_result_brand">
            <span className="mv_result_icon" aria-hidden="true">
              ◆
            </span>
            <span className="mv_result_title">{displayTitle}</span>
          </div>
          {live ? <LiveBadge /> : <span className="mv_expired">EXPIRED</span>}
        </div>

        <div className="mv_result_code">#{shareId}</div>

        {privacy === "incognito" ? (
          <span className="mv_result_privacy">Incognito · burns after one view</span>
        ) : null}

        {remaining != null ? (
          <span className="mv_result_ttl">
            {live ? `Expires in ${formatRemaining(remaining)}` : "This portal has closed"}
          </span>
        ) : null}

        <div className="mv_result_body">
          <div className="mv_result_qr">
            <QRCode value={url || shareId} size={128} bgColor="#ffffff" fgColor="#111111" />
          </div>
          <div className="mv_result_meta">
            <span className="mv_result_label">SHARE LINK</span>
            <span className="mv_result_url">{shortUrl(url)}</span>
            <button type="button" className="mv_btn mv_btn--primary" onClick={copy}>
              Copy link
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export const ShareOptionsBar = ({
  privacy,
  setPrivacy,
  expiresInMs,
  setExpiresInMs,
  options,
}) => (
  <div className="mv_options">
    <div className="mv_option">
      <span>Privacy</span>
      <div className="mv_chip_row" role="group" aria-label="Privacy">
        <button
          type="button"
          className={`mv_chip ${privacy === "public" ? "is-active" : ""}`}
          onClick={() => setPrivacy("public")}
        >
          Public
        </button>
        <button
          type="button"
          className={`mv_chip ${privacy === "incognito" ? "is-active" : ""}`}
          onClick={() => setPrivacy("incognito")}
        >
          Incognito
        </button>
      </div>
    </div>
    <div className="mv_option">
      <span>Expires</span>
      <div className="mv_chip_row" role="group" aria-label="Expiry">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`mv_chip ${expiresInMs === opt.value ? "is-active" : ""}`}
            onClick={() => setExpiresInMs(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);
