import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Box from "@material-ui/core/Box";
import "../style/authDebugger.css";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className= "debugger-card" style={{ overflowX: "auto" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Auth Debugger
          </Typography>

          <Typography variant="h6" gutterBottom>
            Access Token:
          </Typography>
          <Box component="div" display="inline">
            <Typography
              variant="body2"
              component="pre"
              style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
            >
              {JSON.stringify(accessToken, null, 2)}
            </Typography>
          </Box>

          <Box mt={3}>
            <Divider />
          </Box>

          <Typography variant="h6" gutterBottom>
            User Info:
          </Typography>
          <List dense>
            <ListItem>
              <AccountCircleIcon />
              <ListItemText primary={user.nickname} secondary="Nickname" />
            </ListItem>
            <ListItem>
              <VpnKeyIcon />
              <ListItemText primary={user.sub} secondary="User ID" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
}
