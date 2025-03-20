import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessTokenFromURL } from "../utils/tokenHandler";

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getAccessTokenFromURL(); // Extract from URL

        if (accessToken) {
            console.log("✅ Access Token Found:", accessToken);
        } else {
            console.log("❌ No access token found.");
        }
        navigate("/"); // Redirect to home
    }, [navigate]);

    return <p className="text-center text-white mt-10">Logging in...</p>;
};

export default Callback;