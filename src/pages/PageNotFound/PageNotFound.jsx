import './PageNotFound.css';

const PageNotFound = ({ ipData }) => {
  return (
    <div className="pageNotFound_main">
      <div className="pageNotFound_box">
        <div className="pageNotFound_icon">:(</div>
        <div className="pageNotFound_text">
          <h1>This site can’t be reached</h1>
          <p>Your IP <strong>{ipData}</strong> is not allowed to access this page.</p>
          <p>Try checking the connection<br />ERR_ACCESS_DENIED</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
