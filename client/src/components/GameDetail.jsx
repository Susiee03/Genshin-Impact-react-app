import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthToken } from "../AuthTokenContext";

export default function GameDetail() {
  const  {id}  = useParams();
  const gameId = parseInt(id); 
  const [game, setGame] = useState();
  const { accessToken } = useAuthToken();
  //console.log("gameId:   ", gameId);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/games/${gameId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setGame(data);
        } else {
          throw new Error('Failed to fetch game details');
        }
      } catch (error) {
        console.log('Failed to fetch game details:', error);
        setGame(null); // Set game to null in case of error
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  if (!game) {
    return <div>Loading game details...</div>;
  }

  return (
    <div>
      <h2>{game.title}</h2>
      {/* <p>{game.description}</p> */}
      { <Link to={`/games/${gameId}/rating`}>
        <button>Rate Game</button>
      </Link> }
    </div>
  );
}
