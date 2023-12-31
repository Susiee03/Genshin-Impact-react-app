import React, { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useAuthToken = () => useContext(AuthTokenContext);


const requestedScopes = [
  "profile",
  "email",
  "read:comment",
  "write:comment",
  "edit:comment",
  "delete:comment",
  "read:rating",
  "write:rating",
  "edit:rating",
  "read:user",
  "edit:user",
  "delete:user",
  "write:user",
];

const AuthTokenContext = React.createContext();
function AuthTokenProvider({ children }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState();
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: requestedScopes.join(' ')
          },
        });
        setAccessToken(token);
      } catch (err) {
        console.log(err);
      }
    };
    if (isAuthenticated) {
      getAccessToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);
  const value = { accessToken, setAccessToken };
  return (
    <AuthTokenContext.Provider value={value}>
      {children}
    </AuthTokenContext.Provider>
  );
}

export { useAuthToken, AuthTokenProvider };