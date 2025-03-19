import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessTokenFromURL, getStoredAccessToken } from "../utils/tokenHandler";

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let accessToken = getAccessTokenFromURL(); // Extract from URL

        if (!accessToken) {
            accessToken = getStoredAccessToken(); // Check local storage
        }

        if (accessToken) {
            console.log("✅ Access Token Found:", accessToken);
            navigate("/"); // Redirect to home
        } else {
            console.log("❌ No access token found.");
            navigate("/"); // Redirect anyway
        }
    }, [navigate]);

    return <p className="text-center text-white mt-10">Logging in...</p>;
};

export default Callback;