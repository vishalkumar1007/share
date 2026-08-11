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

const TYPE_META = {
  text: {
    title: "Text portal ready",
    blurb: "Anyone with the link or code can open this note.",
  },
  image: {
    title: "Image portal ready",
    blurb: "Share the link or QR so others can preview and download.",
  },
  file: {
    title: "File portal ready",
    blurb: "Send the code or scan the QR to download the file.",
  },
  audio: {
    title: "Audio portal ready",
    blurb: "Open the link to play the audio in any browser.",
  },
};

const PortalSuccess = ({
  type = "text",
  shareId,
  url,
  expiresAt,
  privacy = "public",
  onNewPortal,
  onOpenReceive,
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
  const meta = TYPE_META[type] || {
    title: "Portal ready",
    blurb: "Share the link or QR code to receive.",
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareId);
      toast.success("Code copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <GlassCard className={`portal_success portal_success--${type} ws_board`}>
      <div className="portal_success_top">
        <div>
          <span className="portal_success_kicker">Success · {type}</span>
          <h2 className="portal_success_title">{meta.title}</h2>
          <p className="portal_success_blurb">{meta.blurb}</p>
        </div>
        {live ? <LiveBadge /> : <span className="mv_expired">EXPIRED</span>}
      </div>

      <div className="portal_success_stats">
        <div className="portal_success_stat">
          <span>Code</span>
          <strong>#{shareId}</strong>
        </div>
        <div className="portal_success_stat">
          <span>Privacy</span>
          <strong>{privacy === "incognito" ? "Incognito" : "Public"}</strong>
        </div>
        <div className="portal_success_stat">
          <span>Expiry</span>
          <strong>
            {remaining == null
              ? "No expiry"
              : live
                ? formatRemaining(remaining)
                : "Closed"}
          </strong>
        </div>
      </div>

      {privacy === "incognito" ? (
        <p className="portal_success_note">
          Incognito — burns after one successful view
        </p>
      ) : null}

      <div className="portal_success_grid">
        <div className="portal_success_qr">
          <div className="portal_success_qr_frame">
            <QRCode
              value={url || shareId}
              size={200}
              bgColor="#ffffff"
              fgColor="#111111"
              style={{ width: "100%", height: "auto", maxWidth: 220 }}
            />
          </div>
          <span>Scan to receive</span>
        </div>

        <div className="portal_success_meta">
          <span className="portal_success_label">Share link</span>
          <p className="portal_success_url">{url}</p>

          <div className="portal_success_actions">
            <button
              type="button"
              className="mv_btn mv_btn--primary"
              onClick={copyLink}
            >
              Copy link
            </button>
            <button type="button" className="mv_btn mv_btn--ghost" onClick={copyCode}>
              Copy code
            </button>
            {onOpenReceive ? (
              <button
                type="button"
                className="mv_btn mv_btn--ghost"
                onClick={onOpenReceive}
              >
                Open receive
              </button>
            ) : null}
            <button
              type="button"
              className="mv_btn mv_btn--ghost"
              onClick={onNewPortal}
            >
              New portal
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default PortalSuccess;
