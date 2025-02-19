import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import ProductNotFound from "./ProductNotFound";  // Import the new component

const products = [
  { id: 1, name: "Anime Blind Box", img: "/assets/blindbox1.png", price: 2999.99, brand: "Pop Mart", description: "A surprise anime-themed blind box with exclusive figurines." },
  { id: 2, name: "Superhero Surprise Pack", img: "/assets/blindbox1.png", price: 2500, brand: "My Kingdom", description: "Unleash the hero inside you with this mystery superhero box." },
  { id: 3, name: "Kawaii Collectibles", img: "/assets/blindbox1.png", price: 3200, brand: "Tokidoki", description: "A collection of adorable kawaii items to brighten your day." },
];

const Detailpage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return <ProductNotFound />;  // Render the ProductNotFound component
  }

  return (
    <Box sx={{ bgcolor: "#666", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ position: "relative", bgcolor: "black", p: 4, borderRadius: 4, width: 1300, height: 500, boxShadow: 3, top: 20 }}>

        {/* Back to Collection Button - Positioned at the Top Right */}
        <Link to="/Collection-page" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "black",
              color: "white",
              "&:hover": { bgcolor: "#444" },
            }}
          >
            Back to Collection
          </Button>
        </Link>

        <Grid container spacing={4} alignItems="center">
          {/* Product Image */}
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <img src={product.img} alt={product.name} style={{ width: 500, height: 500, borderRadius: "10p" }} />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6} sx={{ color: "white" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f8b400" }}>{product.name}</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Brand: {product.brand}</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: "#ff4444" }}>Price: ${product.price.toFixed(2)}</Typography>
            <Typography sx={{ mt: 2 }}>{product.description}</Typography>

            {/* Quantity Selector */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>Quantity:</Typography>
              <Box sx={{ display: "flex", alignItems: "center"}}>
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  sx={{ minWidth: "40px", color: "white", bgcolor: "#444", "&:hover": { bgcolor: "#666" },border: "1px solid white", borderRadius: 2 }}
                >
                  -
                </Button>
                <Typography sx={{ mx: 2, color: "white", minWidth: "40px", textAlign: "center",border: "1px solid white", borderRadius: 2 }}>{quantity}</Typography>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  sx={{ minWidth: "40px", color: "white", bgcolor: "#444", "&:hover": { bgcolor: "#666" },border: "1px solid white", borderRadius: 2 }}
                >
                  +
                </Button>
              </Box>
            </Box>

            {/* Add to Cart Button */}
            <Button variant="contained" sx={{ mt: 3, bgcolor: "#ff4444", color: "white", "&:hover": { bgcolor: "#cc0000" } }}>
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Detailpage;
