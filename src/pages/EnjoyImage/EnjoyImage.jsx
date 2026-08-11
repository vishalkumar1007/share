import "./EnjoyImage.css";

const EnjoyImage = ({ ImageTabOpenAction }) => {
  const handelCloseTab = () => {
    ImageTabOpenAction(false);
  };

  return (
    <div className="EnjoyImage_main">
      <div className="EnjoyImage_main_top">
        <button
          className="EnjoyImage_main_top_close_tab"
          onClick={() => handelCloseTab()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="15px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>
      <div className="EnjoyImage_main_top_bottom">
        <div className="EnjoyImage_main_placeholder">
          <div className="EnjoyImage_main_placeholder_icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <circle cx="8.5" cy="10" r="1.6" />
              <path d="m5 18 5.2-5.2a1.4 1.4 0 0 1 2 0L18 18" />
              <path d="m15 13 2-2a1.4 1.4 0 0 1 2 0l1 1" />
            </svg>
          </div>
          <h2 className="EnjoyImage_main_placeholder_title">Image Multiverse</h2>
          <p className="EnjoyImage_main_placeholder_desc">
            Share images across dimensions — Doctor Strange is still charging the
            portal.
          </p>
          <span className="EnjoyImage_main_placeholder_badge">Coming soon</span>
        </div>
      </div>
    </div>
  );
};

export default EnjoyImage;
