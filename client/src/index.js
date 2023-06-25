import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Home from "./components/HomePage";
import NotFound from "./components/NotFound";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import Profile from "./components/Profile"
import { AuthTokenProvider } from "./AuthTokenContext";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Gameshow from './components/GameShow';
import Comment from "./components/Comment";
import GameRating from "./components/GameRating"
import JoinedUsers from "./components/JoinedUsers"
import CommentDetail from "./components/CommentDetail";


const root = ReactDOM.createRoot(document.getElementById('root'));

const requestedScopes = [
  "profile",
  "email",
  "read:games",
  "read:user",
  "edit:game",
  "edit:user",
  "delete:game",
  "delete:user",
  "write:user",
  "write:game",
];


function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}


root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/joined-users" element={<JoinedUsers />} />
            <Route
              path="app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Gameshow />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/comment" element={<Comment />} />
              <Route path="/app/comment/detail/:commentId" element={<CommentDetail />} />
              <Route path="/app/rating" element={<GameRating />} />
              <Route path="/app/debugger" element={<AuthDebugger />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
