import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "../../components/Loading/LoadingScreen";

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
            localStorage.setItem("access_token", accessToken);

            navigate("/", { replace: true });
        }
    }, [location, navigate]);

    return <div><LoadingScreen /></div>;
};

export default AuthCallback;
