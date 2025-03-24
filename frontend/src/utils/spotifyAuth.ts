const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read", // Allows access to liked tracks
];

export const getSpotifyAuthURL = (): string => {
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const scopeString = SCOPES.join("%20");

  return `${authEndpoint}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopeString}`;
};