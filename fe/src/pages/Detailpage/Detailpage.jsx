import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const products = [
  { id: 1, name: "Anime Blind Box", img: "https://via.placeholder.com/150", price: 2999.99, brand: "Pop Mart", description: "A surprise anime-themed blind box with exclusive figurines." },
  { id: 2, name: "Superhero Surprise Pack", img: "https://via.placeholder.com/150", price: 2500, brand: "My Kingdom", description: "Unleash the hero inside you with this mystery superhero box." },
  { id: 3, name: "Kawaii Collectibles", img: "https://via.placeholder.com/150", price: 3200, brand: "Tokidoki", description: "A collection of adorable kawaii items to brighten your day." },
];

const Detailpage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <Box sx={{ p: 4, bgcolor: "black", color: "white", minHeight: "100vh", textAlign: "center", paddingTop: 10 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Product not found!</Typography>
        <Link to="/Collection-page" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ mt: 3, bgcolor: "#666", color: "white" }}>
            Back to Collection
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "black", color: "white", minHeight: "100vh", textAlign: "center", paddingTop: 10 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>{product.name}</Typography>
      <img src={product.img} alt={product.name} style={{ width: "300px", borderRadius: "10px" }} />
      <Typography variant="h6" sx={{ mt: 2 }}>Brand: {product.brand}</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>Price: ${product.price.toFixed(2)}</Typography>
      <Typography sx={{ mt: 2 }}>{product.description}</Typography>
      
      <Link to="/Collection-page" style={{ textDecoration: "none" }}>
        <Button variant="contained" sx={{ mt: 3, bgcolor: "#666", color: "white" }}>
          Back to Collection
        </Button>
      </Link>
    </Box>
  );
};

export default Detailpage;
