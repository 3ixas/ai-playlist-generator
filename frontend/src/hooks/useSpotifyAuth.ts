import { useState, useEffect } from "react";
import { getUserProfile } from "../utils/spotify";

export const useSpotifyAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect (() => {
        const storedToken = localStorage.getItem("spotify_access_token");
        if (storedToken) {
            setAccessToken(storedToken);
            fetchUserProfile(storedToken); // Fetch user profile on page load
        }
    }, []);

    const fetchUserProfile = async (token: string) => {
        const profile = await getUserProfile(token);
        if (profile) setUserProfile(profile);
    };

    const handleSpotifyLogin = () => {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
        const scopes = ["user-read-private", "user-read-email"];

        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join("%20")}`;

        console.log("Redirecting to:", authUrl); // Debug log
        window.location.href = authUrl;
    };

    return { accessToken, userProfile, handleSpotifyLogin };
};