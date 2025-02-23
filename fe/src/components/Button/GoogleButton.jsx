import React from "react";
import { Button } from "@mui/material";

const googleLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
const SCOPE = process.env.REACT_APP_GOOGLE_AUTH_SCOPE;

const GoogleSignInButton = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=offline&prompt=consent`;

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.location.href = googleAuthUrl;
    };

    return (
        <Button
            onClick={handleGoogleLogin}
            variant="outlined"
            fullWidth
            startIcon={<img src={googleLogoUrl} alt="Google logo" style={{ width: "20px", marginRight: "8px" }} />}
            sx={{
                mt: 2,
                mb: 2,
                backgroundColor: "white",
                color: "#000",
                borderColor: "#ccc",
                textTransform: "none",
                "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#bbb",
                },
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            Sign in with Google
        </Button>
    );
};

export default GoogleSignInButton;
