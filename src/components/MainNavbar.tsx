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
          <Link className="login-link" to="/login">
            login
          </Link>
          <Link className="signup-link" to="/signup">
            signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
