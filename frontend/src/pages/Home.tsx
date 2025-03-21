import { useEffect, useState } from "react";
import { getSpotifyAuthURL } from "../utils/spotifyAuth";
import { getStoredAccessToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../utils/spotify";

const Home = () => {
    const [token, setToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getStoredAccessToken();

        if (accessToken) {
            setToken(accessToken);
            getUserProfile(accessToken).then((data) => {
                if (data) {
                    setProfile(data);
                }
            });
        } else {
            console.log("No valid token found, redirecting to login...");
            navigate("/callback");
        }
    }, [navigate]);

    const handleLogin = () => {
        window.location.href = getSpotifyAuthURL();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {token ? (
                profile ? (
                    <>
                        <h1 className="text-2xl font-bold">Welcome, {profile.display_name} 👋</h1>
                        <p>Email: {profile.email}</p>
                    </>
                ) : (
                    <p>Loading profile...</p>
                )
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
