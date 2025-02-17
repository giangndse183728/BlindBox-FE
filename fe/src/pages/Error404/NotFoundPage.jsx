import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box sx={{ textAlign: "center", color: "white", bgcolor: "black", minHeight: "100vh",paddingTop: 10}}>
      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>404</Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>Oops! Page not found.</Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained" sx={{ bgcolor: "#666", color: "white" }}>Back to HomePage</Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
