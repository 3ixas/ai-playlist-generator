import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSpotifyAuthURL } from "../utils/spotifyAuth";
import { getStoredAccessToken } from "../utils/tokenHandler";
import { ClipLoader } from "react-spinners";
import {
  getUserProfile,
  getUserLikedTracks,
  getUserPlaylists,
  getUserTopArtists,
} from "../utils/spotify";

const Home = () => {
    const [token, setToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [likedTracks, setLikedTracks] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [topArtists, setTopArtists] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("short_term");
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingLikedTracks, setIsLoadingLikedTracks] = useState(true);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
    const [isLoadingTopArtists, setIsLoadingTopArtists] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        
        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    
    const toggleDarkMode = () => {
        const html = document.documentElement;
        const isCurrentlyDark = html.classList.contains("dark");
        
        if (isCurrentlyDark) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };


    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getStoredAccessToken();

        if (!accessToken) {
        console.log("No valid token found, redirecting to login...");
        navigate("/callback");
        return;
        }

        setToken(accessToken);

        setIsLoadingProfile(true);
        getUserProfile(accessToken).then((data) => {
            if (data) setProfile(data);
            setIsLoadingProfile(false);
        });

        setIsLoadingLikedTracks(true);
        getUserLikedTracks(accessToken).then((res) => {
            if (res?.items) setLikedTracks(res.items);
            setIsLoadingLikedTracks(false);
        });

        setIsLoadingPlaylists(true);
        getUserPlaylists(accessToken).then((res) => {
            if (res?.items) setPlaylists(res.items);
            setIsLoadingPlaylists(false);
        });
    }, [navigate]);

    useEffect(() => {
        if (!token) return;

        setIsLoadingTopArtists(true);
        getUserTopArtists(token, { timeRange, limit: 10 }).then((res) => {
        if (res?.items) {
            setTopArtists(res.items);
            console.log("🎨 Top Artists:", res.items);
        }
        setIsLoadingTopArtists(false);
        });
    }, [token, timeRange]);

    const handleLogin = () => {
        window.location.href = getSpotifyAuthURL();
    };

    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeRange(e.target.value as "short_term" | "medium_term" | "long_term");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-6 transition-colors duration-300">
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 z-50 px-3 py-2 rounded-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white shadow-md transition-all hover:scale-105"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? "☀️" : "🌙"}
            </button>
        {token ? (
            isLoadingProfile ? (
                <div className="mt-6 w-full max-w-md flex justify-center">
                    <ClipLoader color="#36d7b7" size={35} />
                </div>
            ) : profile ? (
            <>
                <div className="flex flex-col items-center mb-6">
                    {profile.images && profile.images.length > 0 && (
                        <img
                            src={profile.images[0].url}
                            alt={`${profile.display_name}'s profile`}
                            className="w-24 h-24 rounded-full border-2 border-green-400 shadow-md mb-3"
                        />
                    )}
                    <h1 className="text-2xl font-bold transition-colors duration-300">Welcome, {profile.display_name} 👋</h1>
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 transition-colors duration-300">{profile.email}</p>
                </div>

                <div className="mb-6">
                    <label htmlFor="timeRange" className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Select Time Range for Top Artists:
                    </label>
                    <select
                        id="timeRange"
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                        className="bg-white text-gray-900 border border-gray-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 p-2 rounded transition-colors duration-300"
                    >
                        <option value="short_term">Last 4 Weeks</option>
                        <option value="medium_term">Last 6 Months</option>
                        <option value="long_term">All Time</option>
                    </select>
                </div>

                {isLoadingTopArtists ? (
                    <div className="mt-6 w-full max-w-md flex justify-center">
                        <ClipLoader color="#36d7b7" size={30} />
                    </div>
                ) : (
                    <div className="mt-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 dark:border-gray-700 pb-1 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out">
                            Your Top Artists ({timeRange.replace("_", " ")})
                        </h2>
                        {topArtists.length > 0 ? (
                            <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                {topArtists.slice(0, 5).map((artist) => (
                                    <li key={artist.id}>
                                        🎤 {artist.name}{" "}
                                        {artist.genres.length > 0 && (
                                            <span className="text-gray-400">
                                                ({artist.genres.slice(0, 2).join(", ")})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm italic text-gray-500 dark:text-gray-400">No top artists found.</p>
                        )}
                    </div>
                )}

                {isLoadingLikedTracks ? (
                    <div className="mt-6 w-full max-w-md flex justify-center">
                        <ClipLoader color="#36d7b7" size={30} />
                    </div>
                ) : (
                    <div className="mt-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 dark:border-gray-700 pb-1 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out">
                            Your Liked Tracks
                        </h2>
                        {likedTracks.length > 0 ? (
                            <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                {likedTracks.slice(0, 5).map((item) => (
                                    <li key={item.track.id}>
                                        🎶 {item.track.name} —{" "}
                                        {item.track.artists.map((a: any) => a.name).join(", ")}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm italic text-gray-500 dark:text-gray-400">No liked tracks found.</p>
                        )}
                    </div>
                )}

                {isLoadingPlaylists ? (
                    <div className="mt-6 w-full max-w-md flex justify-center">
                        <ClipLoader color="#36d7b7" size={30} />
                    </div>
                ) : (
                    <div className="mt-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 dark:border-gray-700 pb-1 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out">
                            Your Playlists
                        </h2>
                        {playlists.length > 0 ? (
                            <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-100 transition-colors duration-300">
                                {playlists.slice(0, 5).map((playlist) => (
                                    <li key={playlist.id}>📂 {playlist.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm italic text-gray-500 dark:text-gray-400">No playlists found.</p>
                        )}
                    </div>
                )}

            </>
            ) : (
            <p className="text-red-400">Failed to load profile.</p>
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