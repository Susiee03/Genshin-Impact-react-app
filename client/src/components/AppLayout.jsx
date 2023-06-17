import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = React.createContext();

export default function AppLayout() {
    const { user, isLoading, logout } = useAuth0();
  
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
  

    return (
      <div className="app">
        <div className="title">
          <h1>Personal Game App</h1>
        </div>
        <div className="header">
          <nav className="menu">
            <ul className="menu-list">
              <li>
                <Link to="/app/profile">Profile</Link>
              </li>
              <li>
                <Link to="/app/games">Games</Link>
              </li>
              <li>
                <Link to="/app/debugger">Auth Debugger</Link>
              </li>
              <li>
                <button
                  className="exit-button"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  LogOut
                </button>
              </li>
            </ul>
          </nav>
          <div>Welcome 👋 {user.name} </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }
