import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url(/assets/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        zIndex: -1,
      }}
    >
      <img
        src="/assets/gif/bill-cipher-404.gif"
        alt="bill-cipher"
        style={{
          width: 350,
          height: 350,
          marginBottom: 20,
        }}
      />
      <Typography
        variant="h2"
        fontFamily="'Jersey 15', sans-serif"
        sx={{ fontWeight: "bold", mb: 2, color:"white" }}
      >
        404 Not Found 404
      </Typography>
      <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ mb: 3, color:"white" }}>
        Oops! Page not found.
      </Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "yellow", color: "black", fontFamily: "'Yusei Magic', sans-serif" }}
        >
          Back to HomePage
        </Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
