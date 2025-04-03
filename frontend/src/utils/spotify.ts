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
    console.log("Liked Tracks:", data);
    return data;
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return null;
  }
};

export const getUserPlaylists = async (accessToken: string) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=10", {
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
    return data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return null;
  }
};

type TopArtistsOptions = {
  timeRange?: "short_term" | "medium_term" | "long_term";
  limit?: number;
};

export const getUserTopArtists = async (
  accessToken: string,
  options: TopArtistsOptions = {}
) => {
  const { timeRange = "short_term", limit = 10 } = options;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🎨 Top Artists:", data);
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return null;
  }
};

export const getRecommendations = async (
  token: string,
  seed_artists: string[],
  seed_genres: string[],
  seed_tracks: string[]
) => {
  try {
    const seedParams: Record<string, string> = {
      limit: "10",
    };

    if (seed_artists.length > 0) seedParams.seed_artists = seed_artists.join(",");
    if (seed_genres.length > 0) seedParams.seed_genres = seed_genres.join(",");
    if (seed_tracks.length > 0) seedParams.seed_tracks = seed_tracks.join(",");

    const params = new URLSearchParams(seedParams);

    console.log("Requesting recommendations with:", params.toString());

    const res = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text(); // helpful for 404
      throw new Error(`Failed to fetch recommendations: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    return data.tracks;
  } catch (err) {
    console.error("❌ Error fetching recommendations:", err);
    return [];
  }
};