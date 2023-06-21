import { useState, useEffect } from "react";

export default function TwitchAccessToken() {
    const [accessToken, setAccessToken] = useState([]);

    useEffect(() => {
        async function getTwitchAccessTokenFromApi() {


            const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.RTWITCH_APP_CLIENT_ID}&client_secret=${process.env.TWITCH_APP_CLIENT_SECRET}&grant_type=client_credentials`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            const accessToken = data.access_token;
            const expiresIn = data.expires_in;
            const expirationTime = new Date().getTime() + expiresIn * 1000;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("expirationTime", expirationTime);

            setAccessToken(accessToken);

        }

        getTwitchAccessTokenFromApi();


    }, []);


    return [accessToken, setAccessToken];
}