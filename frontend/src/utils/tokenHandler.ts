export const getAccessTokenFromURL = (): string | null => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get("access_token");
};