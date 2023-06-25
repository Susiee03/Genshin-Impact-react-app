import "../style/base.css";
import "../style/appLayout.css";
import React from "react";
import { Outlet, Link} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";


export default function AppLayout() {
  const { isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <nav className="menu">
          <div className="logo">
            <a href="/#">
              <h1>Genshin Impact</h1>
            </a>
          </div>
          <ul className="menu-list">
            <li>
              <Link to="/app/profile">Profile</Link>
            </li>
            <li>
              <Link to="/app/comment">Comments</Link>
            </li>
            <li>
              <Link to="/app/rating">Rating</Link>
            </li>
            <li>
              <Link to="/app/debugger">Debugger</Link>
            </li>
            <li>
              <Button
                variant="contained"
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                LogOut
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
