import { useAuth0 } from "@auth0/auth0-react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import EmailIcon from "@material-ui/icons/Email";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CheckIcon from "@material-ui/icons/Check";
import React from "react";
import "../style/profile.css";

export default function Profile() {
  const { user } = useAuth0();
  return (
    <div className="user-profile wrapper">
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText className="user-name" primary={user.nickname} />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText className="user-email" primary={user.email} />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <VpnKeyIcon />
          </ListItemIcon>
          <ListItemText className="user-sub" primary={user.sub} />
        </ListItem>
        {/* <ListItem button>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary={user.nickname} />
        </ListItem>
        <Divider /> */}
      </List>
    </div>
  );
}
