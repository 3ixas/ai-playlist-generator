export const getAccessTokenFromURL = (): string | null => {
  const hash = window.location.hash;
  console.log("Raw URL Fragment:", hash);

  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1)); // Remove `#` and parse
  const accessToken = params.get("access_token");
  const expiresIn = params.get("expires_in");

  console.log("Extracted Access Token:", accessToken);

  if (accessToken && expiresIn) {
    const expiresAt = Date.now() + parseInt(expiresIn, 10) * 1000; // Convert seconds into a timestamp
    localStorage.setItem("spotify_token", accessToken);
    localStorage.setItem("spotify_token_expiry", expiresAt.toString());
    console.log("Stored token with expiry:", accessToken, expiresAt);
    window.history.replaceState({}, document.title, "/"); // Remove token from URL
  }

  return accessToken;
};

export const getStoredAccessToken = (): string | null => {
  const token = localStorage.getItem("spotify_token");
  const expiry = localStorage.getItem("spotify_token_expiry");

  if (!token || !expiry) {
    console.log("No stored token found");
    return null;
  }

  if (Date.now() > parseInt(expiry, 10)) {
    console.log("Token expired, removing from storage.");
    localStorage.removeItem("Spotify_token");
    localStorage.removeItem("spotify_token_expiry");
    return null;
  }

  console.log("Retrieved valid token from storage:", token);
  return token;
};