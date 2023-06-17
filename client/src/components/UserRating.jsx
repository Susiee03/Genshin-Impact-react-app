import React, { useState } from 'react';
import { useParams} from 'react-router-dom';
import { useAuthToken } from "../AuthTokenContext";

export default function UserRating(){
  const [rating, setRating] = useState(0);
  const { accessToken } = useAuthToken();
  const  {id}  = useParams();
  const gameId = parseInt(id);
  const [latestRating, setLatestRating] = useState(0);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the rating to the server
    fetch(`${process.env.REACT_APP_API_URL}/games/${gameId}/rating`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        rating: parseInt(rating),
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Rating submitted successfully');
          setRating(0);
          setLatestRating(rating);
        } else {
          console.log('Failed to submit rating');
        }
      })
      .catch((error) => {
        console.log('Error submitting rating:', error);
      });
  };

  return (
    <div>
      <h3>Rate this game</h3>
      <form onSubmit={handleSubmit}>
        <select value={rating} onChange={handleRatingChange}>
          <option value={0}>Select rating</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <p>Latest Rating: {latestRating}</p> 
    </div>
  );
}
