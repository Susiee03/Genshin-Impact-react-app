import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function UserComment() {
    const [comments, setComments] = useState([]);
    const { accessToken } = useAuthToken();

    useEffect(() => {
        async function getCommentsFromApi() {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const comments = await data.json();

            setComments(comments);
        }

        if (accessToken) {
            getCommentsFromApi();
        }


    }, [accessToken]);


    return [comments, setComments];
}