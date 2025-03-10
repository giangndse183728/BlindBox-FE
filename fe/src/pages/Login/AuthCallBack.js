import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { fetchUserData } from "../../services/userApi";

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(location.search);
            const accessToken = urlParams.get("access_token");

            if (accessToken) {
                localStorage.setItem("token", accessToken);
                
                try {
                    await fetchUserData();
                    navigate("/", { replace: true });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    navigate("/login", { replace: true });
                }
            }
        };

        fetchData();
    }, [location, navigate]);

    return <div><LoadingScreen /></div>;
};

export default AuthCallback;
