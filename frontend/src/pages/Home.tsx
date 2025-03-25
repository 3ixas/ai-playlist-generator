import { useEffect, useState } from "react";
import { getSpotifyAuthURL } from "../utils/spotifyAuth";
import { getStoredAccessToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";
import { getUserLikedTracks, getUserProfile } from "../utils/spotify";

const Home = () => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [likedTracks, setLikedTracks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getStoredAccessToken();

    if (accessToken) {
      setToken(accessToken);

      getUserProfile(accessToken).then((data) => {
        if (data) {
          setProfile(data);

          getUserLikedTracks(accessToken).then((tracksResponse) => {
            if (tracksResponse && Array.isArray(tracksResponse.items)) {
              setLikedTracks(tracksResponse.items); // Only store the array
              console.log("🎵 Liked Tracks:", tracksResponse.items);
            }
          });
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

            {likedTracks.length > 0 && (
              <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Your Liked Tracks</h2>
                <ul className="space-y-1 text-sm">
                  {likedTracks.slice(0, 5).map((item: any) => (
                    <li key={item.track.id}>
                      🎶 {item.track.name} —{" "}
                      {item.track.artists.map((a: any) => a.name).join(", ")}
                    </li>
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