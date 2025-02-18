import React from 'react';
import { Button } from '@mui/material';
import { useGoogleLogin } from "@react-oauth/google";

const googleLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png';

const GoogleSignInButton = ({ onSuccess }) => {
    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
          console.log("Google Auth Code:", codeResponse);
      
          // Send auth code to backend for exchange
          fetch("http://localhost:5000/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codeResponse.code }),  // Send auth code, not token
          })
            .then((res) => res.json())
            .then((data) => onSuccess(data))
            .catch((err) => console.error("Error:", err));
        },
        onError: () => console.log("Login Failed"),
        redirect_uri: "http://localhost:5000/auth/google", // Redirect to backend
      });



    return (
        <Button
            onClick={login}
            variant="outlined"
            fullWidth
            startIcon={<img src={googleLogoUrl} alt="Google logo" style={{ width: '20px', marginRight: '8px' }} />}
            sx={{
                mt: 2,
                mb: 2,
                backgroundColor: 'white', 
                color: '#000', 
                borderColor: '#ccc', 
                textTransform: 'none', 
                '&:hover': {
                    backgroundColor: '#f5f5f5', 
                    borderColor: '#bbb', 
                },
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            }}
        >
            Sign in with Google
        </Button>
    );
}

export default GoogleSignInButton;
