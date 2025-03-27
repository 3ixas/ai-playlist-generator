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

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      console.log("No valid token found, redirecting to login...");
      navigate("/callback");
      return;
    }

    setToken(accessToken);

    getUserProfile(accessToken).then((data) => {
      if (data) setProfile(data);
    });

    getUserLikedTracks(accessToken).then((res) => {
      if (res?.length) setLikedTracks(res);
    });

    getUserPlaylists(accessToken).then((res) => {
      if (res?.length) setPlaylists(res);
    });
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    getUserTopArtists(token, { timeRange, limit: 10 }).then((res) => {
      if (res?.items) {
        setTopArtists(res.items);
        console.log("🎨 Top Artists:", res.items);
      }
    });
  }, [token, timeRange]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthURL();
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as "short_term" | "medium_term" | "long_term");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {token ? (
        profile ? (
          <>
            <h1 className="text-2xl font-bold mb-1">Welcome, {profile.display_name} 👋</h1>
            <p className="mb-6">Email: {profile.email}</p>

            <div className="mb-6">
              <label htmlFor="timeRange" className="block mb-2 font-semibold">
                Select Time Range for Top Artists:
              </label>
              <select
                id="timeRange"
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="text-white bg-gray-800 border border-gray-600 p-2 rounded"
              >
                <option value="short_term">Last 4 Weeks</option>
                <option value="medium_term">Last 6 Months</option>
                <option value="long_term">All Time</option>
              </select>
            </div>

            {topArtists.length > 0 && (
              <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Top Artists ({timeRange.replace("_", " ")})</h2>
                <ul className="space-y-1 text-sm">
                  {topArtists.slice(0, 5).map((artist) => (
                    <li key={artist.id}>
                      🎤 {artist.name}{" "}
                      {artist.genres.length > 0 && (
                        <span className="text-gray-400">({artist.genres.slice(0, 2).join(", ")})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {likedTracks.length > 0 && (
              <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Your Liked Tracks</h2>
                <ul className="space-y-1 text-sm">
                  {likedTracks.slice(0, 5).map((item) => (
                    <li key={item.track.id}>
                      🎶 {item.track.name} —{" "}
                      {item.track.artists.map((a: any) => a.name).join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {playlists.length > 0 && (
              <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Your Playlists</h2>
                <ul className="space-y-1 text-sm">
                  {playlists.slice(0, 5).map((playlist) => (
                    <li key={playlist.id}>📂 {playlist.name}</li>
                  ))}
                </ul>
              </div>
            )}
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