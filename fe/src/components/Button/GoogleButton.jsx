import React from "react";
import { Button } from "@mui/material";

const googleLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
const SCOPE = process.env.REACT_APP_GOOGLE_AUTH_SCOPE;

const GoogleSignInButton = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
          ].join(' ')
    }
    const googleAuthUrl = `${rootUrl}?${new URLSearchParams(options).toString()}`;

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
