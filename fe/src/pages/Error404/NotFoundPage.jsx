import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box sx={{ textAlign: "center", color: "white", bgcolor: "black", minHeight: "100vh", justifyContent: "center", paddingTop: 20 }}>
      <img 
        src="/assets/mario-running/mario-running.gif" 
        alt="Running Mario" 
        style={{
          width: 200, 
          height: 200, 
          marginBottom: 20
        }} 
      />
      <Typography variant="h2" fontFamily="'Jersey 15', sans-serif" sx={{ fontWeight: "bold", mb: 2 }}>404</Typography>
      <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ mb: 3 }}>Oops! Page not found.</Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained"  fontFamily="'Yusei Magic, sans-serif" sx={{ bgcolor: "red", color: "white" }}>Back to HomePage</Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
