import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { formatDate } from "../utils/formatDate";
import "../style/joinedUser.css";

export default function JoinedUsers() {
  const [userList, setUserList] = React.useState([]);

  const fetchJoinedUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/joined-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const userList = await response.json();
        setUserList(userList);
      } else {
        console.error("Error fetching joined users:", response.status);
      }
    } catch (error) {
      console.error("Error fetching joined users:", error);
    }
  };

  React.useEffect(() => {
    fetchJoinedUsers();
  }, []);

  return (
    <div className="joined-users wrapper">
      <h2>Latest Joined Users</h2>
      <List>
        {userList.map((user, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.createdAt} />
          </ListItem>
        ))}
      </List>
      <div className="center-button">
        <Link to="/">
          <Button className="joinBtn" variant="contained">
            Join Us
          </Button>
        </Link>
      </div>
    </div>
  );
}
