import "../style/base.css";
import "../style/home.css";
const { React } = require("react");
const { useNavigate } = require("react-router-dom");
const { useAuth0 } = require("@auth0/auth0-react");

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="home">
      <div className="welcome-img"></div>
      <div>
        {!isAuthenticated ? (
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        )}
      </div>
      <div>
        <button
          className="btn-secondary"
          onClick={() => navigate("/joined-users")}
        >
          More
        </button>
      </div>
    </div>
  );
}
