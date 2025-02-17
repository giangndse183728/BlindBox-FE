import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import './Img.css'; // Import the CSS file

const NotFoundPage = () => {
  return (
    <Box sx={{ textAlign: "center", color: "white", bgcolor: "black", minHeight: "100vh", justifyContent: "center", paddingTop: 25}}>
      <img
        src="/assets/logoBB.png"
        alt="BlindB!ox"
        className="rotating-logo"
        style={{
          width: 100,
          height: 100,
          marginBottom: 20
        }}
        />
      <Typography variant="h2" fontFamily="'Jersey 15', sans-serif" sx={{ fontWeight: "bold", mb: 2 }}>404</Typography>
      <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ mb: 3 }}>Oops! Page not found.</Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained"  sx={{ bgcolor: "#666", color: "white" }}>Back to HomePage</Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
