//import React, { useContext, useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
//import { useAuth0 } from "@auth0/auth0-react";
const {React, useEffect} = require("react");
const {useContext} = require("react");
const {useState} = require("react");
const {useNavigate} = require("react-router-dom");
const {useAuth0} = require("@auth0/auth0-react")
const EDAMAM_API_URL = "https://api-docs.igdb.com/#getting-started";

// const UserContext = React.createContext();

// function UserProvider({ children }) {
//   const [user, setUser] = useState();
//   const value = { user, setUser };

//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }

// const useUser = () => useContext(UserContext);

export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });

    const [gameData, setGameData] = useState([]);
    const fetchGames = async () => {
      try {
        const response = await fetch('https://api-docs.igdb.com/#getting-started');
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.log('Error fetching games:', error);
      }
    };
  
    return (
        <div className="home">
          <h1>Game App</h1>
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
            <button className="btn-secondary" onClick={signUp}>
              Create Account
            </button>
          </div>


          <div>
          <button className="btn-primary" onClick={fetchGames}>
            Game Button
          </button>
          </div>
          <div>{gameData.length > 0 ? (
            <ul>
            {gameData.map((game) => (
              <li key={game.id}>
                <h3>{game.name}</h3>
                <p>Rating: {game.rating}</p>
              </li>
            ))}
          </ul>
          ) : (
            <p>No games found.</p>
          )}
         </div>

        </div>
      );
  };
  


