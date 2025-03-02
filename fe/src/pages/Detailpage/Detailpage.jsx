import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import ProductNotFound from "./ProductNotFound";
import useCartStore from '../Shoppingcart/CartStore';
import ButtonCus from "../../components/Button/ButtonCus";

const products = [
  { id: 1, name: "Anime Blind Box", img: "/assets/blindbox1.png", price: 2999.99, brand: "Pop Mart", description: "A surprise anime-themed blind box with exclusive figurines." },
  { id: 2, name: "Superhero Surprise Pack", img: "/assets/blindbox1.png", price: 2500, brand: "My Kingdom", description: "Unleash the hero inside you with this mystery superhero box." },
  { id: 3, name: "Kawaii Collectibles", img: "/assets/blindbox1.png", price: 3200, brand: "Tokidoki", description: "A collection of adorable kawaii items to brighten your day." },
];

const Detailpage = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCartStore();
  const product = products.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return <ProductNotFound />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <Box sx={{ bgcolor: "#666", minHeight: "100vh", overflow: 'hidden', display: "flex", justifyContent: "center", alignItems: "center", backgroundImage: "url(/assets/background.jpeg)", backgroundSize: "cover", backgroundPosition: "center", }}>
      <Box sx={{ position: "relative", p: 4, borderRadius: 4, width: 1400, height: 525, boxShadow: 3, top: 30 }}>

        <Link to="/Collection-page" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{ position: "absolute", top: 10, right: 10, bgcolor: "black", color: "white", "&:hover": { bgcolor: "yellow", color: "black" } }}
          >
            <Typography fontFamily="'Jersey 15', sans-serif">
              Back to Collection
            </Typography>
          </Button>
        </Link>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <img src={product.img} alt={product.name} style={{ width: 500, height: 500, borderRadius: "10px" }} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ color: "white" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f8b400" }}>{product.name}</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Brand: {product.brand}</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: "#ff4444" }}>Price: ${product.price.toFixed(2)}</Typography>
            <Typography sx={{ mt: 2 }}>{product.description}</Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>Quantity:</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  sx={{ minWidth: "40px", color: "white", bgcolor: "#444", "&:hover": { bgcolor: "#666" }, border: "1px solid white", borderRadius: 2 }}
                >
                  -
                </Button>
                <Typography sx={{ mx: 2, color: "white", minWidth: "40px", textAlign: "center", border: "1px solid white", borderRadius: 2 }}>{quantity}</Typography>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  sx={{ minWidth: "40px", color: "white", bgcolor: "#444", "&:hover": { bgcolor: "#666" }, border: "1px solid white", borderRadius: 2 }}
                >
                  +
                </Button>
              </Box>
            </Box>
            <ButtonCus
              variant="button-pixel-red"
              width="20%"
              height="40px"
              onClick={handleAddToCart}
            >
              <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                Add to Cart
              </Typography>
            </ButtonCus>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Detailpage;