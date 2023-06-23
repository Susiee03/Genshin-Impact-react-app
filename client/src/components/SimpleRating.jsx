import { React, useState } from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useAuthToken } from "../AuthTokenContext";

export default function SimpleRating() {
  const [value, setValue] = useState(0);
  const { accessToken } = useAuthToken();

  const fetchRating = async () => {
    console.log("accessToken");
    console.log(accessToken);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ratings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setValue(data[0].rating);
        } else {
          setValue(0);
        }
      } else {
        console.error("Error fetching rating:", response.status);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const handleChange = async (event, newValue) => {
    setValue(newValue);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ rating: newValue }),
      });

      if (response.ok) {
        console.log("Rating submitted successfully");
      } else {
        console.error("Error submitting rating:", response.status);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  if (!accessToken) {
    return null;
  }

  fetchRating();

  return (
    <div className="simple-rating-container">
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography
          component="legend"
          style={{ fontSize: "20px", fontWeight: "bold" }}
        >
          Rating
        </Typography>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={handleChange}
        />
      </Box>
    </div>
  );
}
