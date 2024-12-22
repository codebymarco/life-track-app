import { Link, useNavigate } from "react-router-dom";

const MainNavbar = () => {
  const navigate = useNavigate();

  const route = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <h1 className="logo-navbar" onClick={() => route(`/`)}></h1>
      <div className="usernavbarlinks" id="usernavbarlinks">
        <div className="usernavbarlinks-container">
          <Link className="login-link" to="/entries">
            entries
          </Link>
          <Link className="login-link" to="/diet">
            diet
          </Link>
          <Link className="login-link" to="/journal">
            journal
          </Link>
          <Link className="login-link" to="/status">
            status
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
