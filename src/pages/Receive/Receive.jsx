import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../../api/client.js";

const VALID = new Set(["text", "image", "file", "audio"]);

/** Legacy /receive → /{type}?mode=receive (resolve type from code when possible). */
const ReceiveRedirect = () => {
  const location = useLocation();
  const code = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (
      params.get("multiversecode") ||
      params.get("code") ||
      params.get("id") ||
      ""
    ).trim();
  }, [location.search]);

  const [type, setType] = useState(code ? null : "text");

  useEffect(() => {
    if (!code) {
      setType("text");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await api.getShareStatus(code);
        const resolved = ok && data?.data?.type;
        if (!cancelled) {
          setType(VALID.has(resolved) ? resolved : "text");
        }
      } catch {
        if (!cancelled) setType("text");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!type) return null;

  const params = new URLSearchParams(location.search);
  params.set("mode", "receive");
  if (code && !params.get("multiversecode")) {
    params.set("multiversecode", code);
  }
  const qs = params.toString();

  return <Navigate to={`/${type}${qs ? `?${qs}` : ""}`} replace />;
};

export default ReceiveRedirect;
