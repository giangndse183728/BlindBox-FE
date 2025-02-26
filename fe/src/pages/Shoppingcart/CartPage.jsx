import React, { useEffect } from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const totalPrice = (cart || []).reduce((total, item) => total + item.price * item.quantity, 0);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0) {
      addToCart(item, newQuantity); // Update quantity directly
    }
  };

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f8f7", minHeight: "100vh", color: "white", backgroundImage: "url(/assets/background.jpeg)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '4rem' }}>Shopping Cart</Typography>
      </Box>
      {cart.length === 0 ? (
        <Box>
          <img
            src="/assets/gif/bill-cipher-Cartpage.gif"
            alt="Collection Banner"
            style={{
              width: "30%",
              height: "30%",
              display: "block",
              paddingTop:80,
              margin: "0 auto",
            }}
          />
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", textAlign: 'center', ...yellowGlowAnimation, fontSize: '4rem' }}>Your cart is empty!!</Typography>
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", textAlign: 'center', ...yellowGlowAnimation, fontSize: '2rem' }}>You can find what you seek with a click of a button</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Link to="/Collection-page" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined" // Use outlined variant for border
                sx={{
                  color: "white",
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  "&:hover": { bgcolor: "yellow", color: "black" },
                }}
              >
                Back to Collection
              </Button>
            </Link>
          </Box>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ borderBottom: '1px solid #ccc', pb: 2 }}>
            <Grid item xs={6}><Typography variant="h6" sx={{ color: "white" }}>Product</Typography></Grid>
            <Grid item xs={2}><Typography variant="h6" sx={{ color: "white" }}>Unit Price</Typography></Grid>
            <Grid item xs={2}><Typography variant="h6" sx={{ color: "white" }}>Quantity</Typography></Grid>
            <Grid item xs={2}><Typography variant="h6" sx={{ color: "white" }}>Actions</Typography></Grid>
          </Grid>

          {cart.map((item) => (
            <Grid container spacing={2} key={item.id} sx={{ alignItems: 'center', borderBottom: '1px solid #ccc', py: 2 }}>
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: 80, height: 80, borderRadius: '10px', marginRight: '16px' }}
                />
                <Typography sx={{ color: "white" }}>{item.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ color: "white" }}>${item.price.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  sx={{ minWidth: "40px", color: "white" }}
                >
                  -
                </Button>
                <Typography sx={{ mx: 2, color: "white" }}>{item.quantity}</Typography>
                <Button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  sx={{ minWidth: "40px", color: "white" }}
                >
                  +
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button onClick={() => removeFromCart(item.id)} variant="contained" color="error">Delete</Button>
              </Grid>
            </Grid>
          ))}

          <Box sx={{ mt: 4, p: 3, borderRadius: 1, boxShadow: 1 }}>
            <Typography variant="h5" sx={{ color: "white" }}>Total Price: ${totalPrice.toFixed(2)}</Typography>
            <Button variant="contained" onClick={clearCart} sx={{ mt: 2 }}>Clear Cart</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CartPage;