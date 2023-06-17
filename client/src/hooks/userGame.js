import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useGames() {
  const [games, setGames] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getGamesFromApi() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/games`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const games = await data.json();

      setGames(games);
    }

    if (accessToken) {
      getGamesFromApi();
    }
    

  }, [accessToken]);


  return [games, setGames];
}