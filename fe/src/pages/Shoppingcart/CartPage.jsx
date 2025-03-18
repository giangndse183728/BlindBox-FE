import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import useCartStore from './CartStore';
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import ButtonCus from "../../components/Button/ButtonCus";
import DeleteIconOutlined from '@mui/icons-material/DeleteOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, fetchCartItems, isLoading, error } = useCartStore();
  
  const cartItems = cart || [];
  
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.totalPrice || 0);
  }, 0);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(item.product._id, newQuantity);
    }
  };

  const handleDelete = (item) => {
    removeFromCart(item.product._id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000 });
    AOS.refresh(); // Ensures reinitialization
  }, []);         

  return (
    <>
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: "url(/assets/background.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: -2,
    }}/>

    <Grid container data-aos="fade" data-aos-delay="200" sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 12,
     
      }}>
        {cartItems.length > 0 && (
          <Box sx={{ width: '93%', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h5" 
              fontFamily="'Jersey 15', sans-serif" 
              sx={{ 
                color: "white", 
                fontSize: '3rem', 
                ...yellowGlowAnimation,
                textAlign: 'left'
              }}
            >
              Shopping Cart
            </Typography>
            <ButtonCus
              variant="button-pixel-red"
              onClick={handleClearCart}
              width="120px"
              height="40px"
            >
              <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                Clear Cart
              </Typography>
            </ButtonCus>
          </Box>
        )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : error ? (
        <Box sx={{ mt: 10 }}>
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "red", textAlign: 'center', fontSize: '2rem' }}>
            {error}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => fetchCartItems()}
              sx={{
                color: "white",
                border: "2px solid white",
                backgroundColor: "transparent",
                "&:hover": { bgcolor: "yellow", color: "black" },
              }}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      ) : cartItems.length === 0 ? (
        <Box sx={{ mt: 10 }}>
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", textAlign: 'center', ...yellowGlowAnimation, fontSize: '4rem' }}>Your cart is empty!!</Typography>
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", textAlign: 'center', fontSize: '2rem' }}>You can find what you seek with a click of a button</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Link to="/Collection-page" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  "&:hover": { bgcolor: "yellow", color: "black" },
                }}
              >
                MAGIC!!!!!
              </Button>
            </Link>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ px: 5 }}>
          {/* Cart Items List  */}
          <Grid item xs={12} lg={9}>
            <Box sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              borderRadius: 2,
              p: 3
            }}>
              {/* Header Row */}
              <Grid container spacing={2} sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 2 }}>
                <Grid item xs={5}>
                  <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
                    Product Name
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
                   From
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
                    Price
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
                    Qty
                  </Typography>
                </Grid>
                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '1.5rem' }}>
                   
                  </Typography>
                </Grid>
              </Grid>

             
              {cartItems.map((item) => (
                <Grid container spacing={2} key={item._id} sx={{ 
                  alignItems: 'center', 
                  borderBottom: '1px solid rgba(255,255,255,0.1)', 
                  py: 2 
                }}>
                  <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link to={`/product/${item.product?._id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        style={{ width: 80, height: 80, borderRadius: '10px', marginRight: '16px' }}
                      />
                      <Typography sx={{ color: "white" }}>{item.product?.name}</Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: "white" }}>Seller</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: "white" }}>${parseFloat(item.product?.price).toFixed(2) || "N/A"}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ButtonCus 
                      variant="button-pixel" 
                      onClick={() => handleQuantityChange(item, item.cartQuantity - 1)} 
                      width="30px" 
                      height="30px"
                      disabled={isLoading}
                    >
                      -
                    </ButtonCus>
                    <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ mx: 2, color: "white" }}>
                      {item.cartQuantity}
                    </Typography>
                    <ButtonCus 
                      variant="button-pixel" 
                      onClick={() => handleQuantityChange(item, item.cartQuantity + 1)} 
                      width="30px" 
                      height="30px"
                      disabled={isLoading}
                    >
                      +
                    </ButtonCus>
                  </Grid>
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>
                    <ButtonCus 
                      variant="button-pixel-red" 
                      onClick={() => handleDelete(item)} 
                      width="40px"
                      height="40px"
                      disabled={isLoading}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIconOutlined sx={{ fontSize: 20 }} />
                      </Box>
                    </ButtonCus>
                  </Grid>
                </Grid>
              ))}
  
            </Box>
          </Grid>

          {/* Checkout Box */}
          <Grid item xs={12} lg={3}>
            <Box sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              p: 4,
              borderRadius: 2,
              position: 'sticky',
              top: 100
            }}>
              <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", mb: 3 }}>
                Order Summary
              </Typography>
              
              {/* Coupon Input Field */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Enter coupon code"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferIcon sx={{ color: 'white' }}/>
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiInput-underline:before': {
                      borderBottomColor: 'white',
                    },
                  }}
                />
            
              </Box>

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                {/* Subtotal */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Typography sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
                    Subtotal:
                  </Typography>
                  <Typography sx={{ color: "white" }}>
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>

                {/* Discount */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 2,
                }}>
                  <Typography sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
                    Discount:
                  </Typography>
                  <Typography sx={{ color: "#ff4444" }}>
                    -$0.00
                  </Typography>
                </Box>

                {/* Divider */}
                <Box sx={{ 
                  width: '100%', 
                  height: '1px', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  my: 2 
                }} />

                {/* Total */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 3,
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: "white", 
                      fontFamily: "'Jersey 15', sans-serif", 
                      ...yellowGlowAnimation 
                    }}
                  >
                    Total:
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: "white",
                      fontFamily: "'Jersey 15', sans-serif",
                    }}
                  >
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Checkout Buttons */}
              <ButtonCus
                variant="button-pixel-green"
                width="100%"
                height="40px"
                disabled={isLoading || cartItems.length === 0}
              >
                <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                  Proceed to Checkout
                </Typography>
              </ButtonCus>
              <Link to="/Collection-page" style={{ textDecoration: "none" }}>
                <ButtonCus
                  variant="button-pixel"
                  width="100%"
                  height="30px"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                    Continue Shopping
                  </Typography>
                </ButtonCus>
              </Link>
            </Box>
          </Grid>
        </Grid>
      )}
    </Grid>
    </>
  );
};

export default CartPage;