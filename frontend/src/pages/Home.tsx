import { useEffect, useState } from "react";
import { getSpotifyAuthURL } from "../utils/spotifyAuth";
import { getStoredAccessToken } from "../utils/tokenHandler";

const Home = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = getStoredAccessToken();
        if (accessToken) setToken(accessToken);
    }, []);

    const handleLogin = () => {
        window.location.href = getSpotifyAuthURL();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {token ? (
                <h1 className="text-2xl font-bold">Logged in! 🎵</h1>
            ) : (
                <button
                    onClick={handleLogin}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
                >
                    Login with Spotify
                </button>
            )}
        </div>
    );
};

export default Home;