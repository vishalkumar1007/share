import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

const TYPES = ["text", "image", "file", "audio"];

/** Legacy /types → /text (or typed path) preserving query. */
const TypesRedirect = () => {
  const location = useLocation();
  const to = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const type = TYPES.includes(params.get("type")) ? params.get("type") : "text";
    params.delete("type");
    const qs = params.toString();
    return `/${type}${qs ? `?${qs}` : ""}`;
  }, [location.search]);

  return <Navigate to={to} replace />;
};

export default TypesRedirect;
