import {Link } from 'react-router-dom';
import { useState } from "react";
import useGames from "../hooks/userGame";
import { useAuthToken } from "../AuthTokenContext";

export default function Games() {
  const [newGameText, setNewGameText] = useState("");
  const [games, setGames] = useGames();
  const { accessToken } = useAuthToken();

  //create new game
  async function insertGame(title) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: title,
      }),
    });
    if (data.ok) {
      const game = await data.json();
      return game;
    } else {
      return null;
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!newGameText) return;

    const newGame = await insertGame(newGameText);
    if (newGame) {
      setGames([...games, newGame]);
      setNewGameText("");
    }
  };
    //delete a game
    const handleGameDelete = async (gameId) => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/games/${gameId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const deletedGame = await response.json();
        const updatedGames = games.filter((game) => game.id !== deletedGame.id);
        setGames(updatedGames);
      } else {
        console.log("Failed to delete the game.");
      }
    };

    //get the game details
    const handleGameDetail = async (gameId) => {
      try{
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/games/${gameId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const gameDetail = await response.json();
        return gameDetail;
      } else {
        return null;
      }
    }
      catch (err) {
        console.log(err)
      }
    };

  return (
    <div className="game-list">
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className="game-form"
        autoComplete="off"
      >
        <input
          type="text"
          name="item"
          id="item"
          value={newGameText}
          onChange={(e) => setNewGameText(e.target.value)}
        />
        <button type="submit">+ Add Game</button>
      </form>

      <ul className="list">
        {games.map((game) => {
          return (
            <li key={game.id} className="game-item">
              <input
                onChange={(e) => console.log(e.target)}
                value={game.id}
                type="checkbox"
                checked={game.completed}
              />
              <span className="itemName"> 
                <Link to={`/games/${game.id}`} >{game.title}</Link> 
              </span>
              <button aria-label={`Remove ${game.title}`} value={game.id}
              onClick={() => handleGameDelete(game.id)}>
                X
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}