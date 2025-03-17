import { getSpotifyAuthURL } from "./utils/spotifyAuth";

function App() {
  const handleLogin = () => {
    window.location.href = getSpotifyAuthURL();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
      >
        Login with Spotify
      </button>
    </div>
  );
}

export default App;