import { CLIENT_ID, CLIENT_SECRET } from './clientInfo';

const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;

const baseURL = (id, secret) => `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${id}&client_secret=${secret}`;

export default async function getSpotifyToken() {
    try {
        const response = await fetch(baseURL(clientId, clientSecret), {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });

        const { access_token, token_type } = await response.json();

        return `${token_type} ${access_token}`;
    } catch (error) {
        console.log(error);
        throw error;
    }
}