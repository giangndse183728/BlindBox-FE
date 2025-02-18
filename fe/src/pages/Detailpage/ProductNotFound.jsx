import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const ProductNotFound = () => {
  return (
    <Box sx={{ p: 4, bgcolor: "#666", color: "white", minHeight: "100vh", textAlign: "center", paddingTop: 25 }}>
      <img
        src="/assets/gif/floating-bill-cipher.gif"
        alt="BlindB!ox"
        className="rotating-logo"
        style={{ width: 180, height: 170, marginBottom: 20 }}
      />
      <Typography variant="h4" fontFamily="'Jersey 15', sans-serif" sx={{ mb: 2 }}>
        Sadly! The product you find does not exist!
      </Typography>
      <Link to="/Collection-page" style={{ textDecoration: "none" }}>
        <Button variant="contained" sx={{ mt: 3, bgcolor: "black", color: "white" }}>
          Find other products here! 😁
        </Button>
      </Link>
    </Box>
  );
};

export default ProductNotFound;
