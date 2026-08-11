import { useSearchParams, useNavigate } from "react-router-dom";
import FeatureShell from "../../components/FeatureShell/FeatureShell";
import ShareWorkspace from "../../components/ShareWorkspace/ShareWorkspace";
import "./Share.css";

const Share = ({ fixedType = "text" }) => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const modeParam = params.get("mode") === "receive" ? "receive" : "share";
  const code = params.get("multiversecode") || "";

  const syncParams = ({ mode } = {}) => {
    const next = new URLSearchParams(params);
    if (mode) next.set("mode", mode);
    if (mode === "share") next.delete("multiversecode");
    setParams(next, { replace: true });
  };

  return (
    <FeatureShell>
      <ShareWorkspace
        key={fixedType}
        initialType={fixedType}
        fixedType={fixedType}
        initialMode={modeParam}
        initialCode={code}
        embedded
        hideUniverseRail
        onModeChange={(mode) => syncParams({ mode })}
        onReceiveNavigate={(shareId) =>
          navigate(
            `/${fixedType}?mode=receive&multiversecode=${encodeURIComponent(shareId)}`
          )
        }
      />
    </FeatureShell>
  );
};

export default Share;
