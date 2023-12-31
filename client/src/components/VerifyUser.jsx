const {useEffect} = require("react");
const {useAuthToken} = require("../AuthTokenContext");
const { useNavigate } = require("react-router-dom");

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function verifyUser() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await data.json();
      if (user.auth0Id) {
        navigate("/app");
      }
    }
    if (accessToken) {
      verifyUser();
    }
  }, [accessToken]);
  return <div className="loading">Loading...</div>;
}

