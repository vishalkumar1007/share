import "./PortalLoader.css";

const PortalLoader = () => (
  <motion.div
    className="portal_loader"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, filter: "blur(8px)" }}
    transition={{ duration: 0.55, ease: "easeInOut" }}
  >
    <div className="portal_loader_stage" aria-hidden="true">
      <span className="portal_loader_ring portal_loader_ring--outer" />
      <span className="portal_loader_ring portal_loader_ring--mid" />
      <span className="portal_loader_ring portal_loader_ring--inner" />
      <span className="portal_loader_core" />
    </div>
    <motion.p
      className="portal_loader_brand"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
    >
      Multiverse
    </motion.p>
    <motion.span
      className="portal_loader_sub"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.45 }}
    >
      Opening portals…
    </motion.span>
  </motion.div>
);

export default PortalLoader;
