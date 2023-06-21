import "../style/base.css";
import "../style/gameRating.css";
import SimpleRating from "./SimpleRating";
const { React, useEffect, useState } = require("react");

export default function GameRating() {
  const clientId = "m1v0wytifjsizduyeort4l94k8e0f1";
  const clientSecret = "vxmo3qjrywb4sjrtd8dbjx259na4tr";
  const [accessToken, setAccessToken] = useState(null);
  const [gameData, setGameData] = useState(null);

  const fetchAccessToken = async () => {
    const storedToken = localStorage.getItem("accessToken");
    const expirationTime = localStorage.getItem("expirationTime");
    if (
      storedToken &&
      expirationTime &&
      new Date().getTime() < Number(expirationTime)
    ) {
      setAccessToken(storedToken);
    } else {
      try {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const accessToken = data.access_token;
          const expiresIn = data.expires_in;
          const expirationTime = new Date().getTime() + expiresIn * 1000;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("expirationTime", expirationTime);
          setAccessToken(accessToken);
        } else {
          throw new Error("Failed to fetch access token");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchGame = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/games`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientId, accessToken }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGameData(data[0]);
      } else {
        console.error("Error adding comment:", response.status);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchGame();
    }
  }, [accessToken]);

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="rating-page">
      {gameData && (
        <div className="wrapper">
          <div className="game-header">
            <div className="game-cover">
              <img
                className="img-responsive cover_big"
                alt="Genshin Impact"
                src="https://images.igdb.com/igdb/image/upload/t_cover_big/co480t.png"
              ></img>
            </div>
            <div className="game-summary">
              <div className="game-title-wrapper">
                <h1>{gameData.name}</h1>
                <h2>{formatDate(gameData.first_release_date)}</h2>
                <span className="storyLine">{gameData.storyline}</span>
              </div>
            </div>
          </div>

          <div className="game-rating">
            <div className="rating-breakdown">
              <strong className="brakdown">Rating breakdown</strong>
              <img
                src="https://www.igdb.com/games/genshin-impact/rating_breakdown.svg"
                alt="Rating breakdown of Genshin Impact"
              ></img>
            </div>
            <div className="rating-mark">
              {/* <p>Based on {gameData.rating_count} member ratings</p> */}
              <p className="rating-title">How would you rate this game?</p>
            </div>
            <div className="star-rating">
              <SimpleRating />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
