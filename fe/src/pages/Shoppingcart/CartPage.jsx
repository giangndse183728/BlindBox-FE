import React from 'react';
import { useCart } from "./CartContext";
import { Box, Typography, Button, Grid } from "@mui/material";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const totalPrice = (cart || []).reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Box sx={{ p: 4, bgcolor: "#666", minHeight: "100vh", color: "white" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Shopping Cart</Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cart.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Typography>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</Typography>
                <Button onClick={() => removeFromCart(item.id)} variant="contained" color="error">Remove</Button>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h5">Total: ${totalPrice.toFixed(2)}</Typography>
          <Button variant="contained" onClick={clearCart}>Clear Cart</Button>
        </>
      )}
    </Box>
  );
};

export default CartPage;