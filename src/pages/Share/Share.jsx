import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import FeatureShell from "../../components/FeatureShell/FeatureShell";
import ShareWorkspace from "../../components/ShareWorkspace/ShareWorkspace";
import "./Share.css";

const Share = ({ fixedType = "text" }) => {
  const { code: pathCode } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const explicitMode = params.get("mode");
  const code = (params.get("multiversecode") || pathCode || "").trim();
  const modeParam =
    explicitMode === "share" || explicitMode === "receive"
      ? explicitMode
      : pathCode
        ? "receive"
        : "share";

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
          navigate(`/${fixedType}/${encodeURIComponent(shareId)}`)
        }
      />
    </FeatureShell>
  );
};

export default Share;
