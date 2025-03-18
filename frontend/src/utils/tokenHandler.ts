export const getAccessTokenFromURL = (): string | null => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const token = hashParams.get("access_token");

  if (token) {
    localStorage.setItem("spotify_token", token);
  }

  return token;
};

export const getStoredAccessToken = (): string | null => {
  return localStorage.getItem("spotify_token");
};