export const getAccessTokenFromURL = (): string | null => {
  const hash = window.location.hash;
  console.log("Raw URL Fragment:", hash); // Debugging step

  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1)); // Remove `#` and parse
  const accessToken = params.get("access_token");

  console.log("Extracted Access Token:", accessToken); // Debugging step

  if (accessToken) {
    console.log("Storing token in local storage..."); // Confirm storage
    localStorage.setItem("spotify_token", accessToken);
    console.log("Stored token:", localStorage.getItem("spotify_token")); // Confirm storage worked
    window.history.replaceState({}, document.title, "/"); // Remove token from URL
  }

  return accessToken;
};

export const getStoredAccessToken = (): string | null => {
  const token = localStorage.getItem("spotify_token");
  console.log("Retrieved Token from Storage:", token); // Debugging step
  return token;
};