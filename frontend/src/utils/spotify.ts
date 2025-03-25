export const getUserProfile = async (accessToken: string) => {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("User Profile:", data); // Log profile data to confirm it works
        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const getUserLikedTracks = async (accessToken: string) => {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Liked Tracks:", data); // Inspect structure and items
        return data.items; // Array of track entries
    } catch (error) {
        console.error("Error fetching liked songs:", error);
        return null;
    }
};

export const getUserPlaylists = async (accessToken: string) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=10", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📁 User Playlists:", data);
    return data.items;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return null;
  }
};