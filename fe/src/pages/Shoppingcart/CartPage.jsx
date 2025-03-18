import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import useCartStore from './CartStore';
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, TextField, InputAdornment, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Switch, Divider } from "@mui/material";
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import ButtonCus from "../../components/Button/ButtonCus";
import DeleteIconOutlined from '@mui/icons-material/DeleteOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { fetchProfile } from '../../services/userApi';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import GlassCard from "../../components/Decor/GlassCard";
import OrderInfoDialog from './OrderInfoDialog';
import EditIcon from '@mui/icons-material/Edit';
import { createOrder } from '../../services/ordersApi';
import { toast } from 'react-toastify';
import OrderSuccessScreen from './OrderSuccessScreen';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, fetchCartItems, isLoading, error } = useCartStore();

  const [orderInfo, setOrderInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    paymentMethod: 'cod',
    isGift: false,
    notes: '', 
    giftRecipient: {
      fullName: '',
      phoneNumber: '',
      address: ''
    }
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setProfileLoading(true);
        const userData = await fetchProfile();

        // Only update the buyer info, not the gift recipient info
        setOrderInfo(prev => ({
          ...prev,
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || ''
        }));

        setProfileError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileError('Failed to load user information');
      } finally {
        setProfileLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const paymentMethods = {
    cod: { name: 'COD', icon: <LocalShippingIcon /> },
    banking: { name: 'Banking', icon: <AccountBalanceIcon /> }
  };

  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;

    // Check if this is for the gift recipient
    if (name.startsWith('gift.')) {
      const giftField = name.split('.')[1];
      setOrderInfo(prev => ({
        ...prev,
        giftRecipient: {
          ...prev.giftRecipient,
          [giftField]: value
        }
      }));
    } else {
      setOrderInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGiftToggle = (event) => {
    setOrderInfo(prev => ({
      ...prev,
      isGift: event.target.checked
    }));
  };

  const cartItems = cart || [];

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.totalPrice || 0);
  }, 0);

  const subtotal = totalPrice;
  const totalWithShipping = subtotal; // No shipping cost added

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

  const handleOpenOrderDialog = () => {
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError(null);

      const items = cartItems.map(item => ({
        itemId: item._id, 
        quantity: item.cartQuantity
      }));
      
      // Build the order data with notes from orderInfo
      const orderData = {
        receiverInfo: {
          fullName: orderInfo.isGift ? orderInfo.giftRecipient.fullName : orderInfo.fullName,
          phoneNumber: orderInfo.isGift ? orderInfo.giftRecipient.phoneNumber : orderInfo.phoneNumber,
          address: orderInfo.isGift ? orderInfo.giftRecipient.address : orderInfo.address
        },
        orderType: 1, 
        promotionId: "", 
        // Include notes field from orderInfo, with a fallback if gift
        notes: orderInfo.notes || (orderInfo.isGift ? "This is a gift" : ""),
        paymentMethod: orderInfo.paymentMethod === 'cod' ? 0 : 1, 
        items: items 
      };
      
      const response = await createOrder(orderData);
      
      clearCart();
      
      toast.success('Order placed successfully!');

      navigate('/order-success', { 
        state: { 
          orderData: response.result,
          paymentMethod: orderInfo.paymentMethod
        }
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.errors) {
        const errorMessages = Object.values(error.errors)
          .map(err => err.msg)
          .join(', ');
        setCheckoutError(errorMessages || 'Validation error. Please check your information.');
        toast.error(errorMessages || 'Validation error. Please check your information.');
      } else {
        setCheckoutError(error.message || 'Failed to place order. Please try again.');
        toast.error(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  return (
    <>
      {orderSuccess && orderData ? (
        <OrderSuccessScreen orderData={orderData} />
      ) : (
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
        }} />
      )}

      <Grid container data-aos="fade" data-aos-delay="200" sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 3,


      }}>
        {cartItems.length > 0 && (
          <Box sx={{ width: '93%', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="h5"
              fontFamily="'Jersey 15', sans-serif"
              sx={{
                color: "white",
                fontSize: '2.2rem',
                ...yellowGlowAnimation,
                textAlign: 'left'
              }}
            >
              -  &nbsp;Shopping Cart &nbsp;  -
            </Typography>


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
    disabled={isLoading || item.cartQuantity <= 1} // Disable if quantity is 1
  >
    -
  </ButtonCus>

  <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ mx: 2, color: "white" }}>
    {item.cartQuantity}
  </Typography>

  {item.cartQuantity < item.product.quantity && ( // Hide + button when reaching stock limit
    <ButtonCus
      variant="button-pixel"
      onClick={() => handleQuantityChange(item, item.cartQuantity + 1)}
      width="30px"
      height="30px"
      disabled={isLoading}
    >
      +
    </ButtonCus>
  )}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 5 }}>
                  <Typography
                    color="white"
                    sx={{
                      ...yellowGlowAnimation,
                      textAlign: 'right',
                      position: 'relative',

                      fontSize: '2rem',
                      fontFamily: '"Jersey 15", sans-serif !important',
                    }}
                  >
                    *****************
                  </Typography>

                  <ButtonCus
                    variant="button-pixel-red"
                    onClick={handleClearCart}
                    width="120px"
                    height="30px"

                  >
                    <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                      Clear Cart
                    </Typography>
                  </ButtonCus>
                  <Typography
                    color="white"
                    sx={{
                      ...yellowGlowAnimation,
                      textAlign: 'right',
                      position: 'relative',

                      fontSize: '2rem',
                      fontFamily: '"Jersey 15", sans-serif !important',
                    }}
                  >
                    *****************
                  </Typography>
                </Box>

              </Box>

            </Grid>

            {/* Checkout Box */}
            <Grid item xs={12} lg={3}>
              <Box sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                p: 3,
                borderRadius: 2,
                position: 'sticky',
                top: 90
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                    Order Summary
                  </Typography>


                  <ButtonCus
                    variant="button-pixel"
                    width="50px"
                    height="30px"

                    onClick={handleOpenOrderDialog}
                  >
                    <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                      <EditIcon />
                    </Typography>
                  </ButtonCus>
                </Box>





                {/* Display shipping info summary if available */}
                {(orderInfo.isGift ? orderInfo.giftRecipient.fullName : orderInfo.fullName) && (
                  <Box sx={{
                    mb: 3,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                  }}>
                    <Typography sx={{
                      color: "white",
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: '0.9rem',
                      mb: 0.5
                    }}>
                      {orderInfo.isGift ? 'Gift to: ' + orderInfo.giftRecipient.fullName : orderInfo.fullName}
                    </Typography>
                    <Typography sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: '0.8rem',
                      mb: 0.5
                    }}>
                      {orderInfo.isGift ? orderInfo.giftRecipient.phoneNumber : orderInfo.phoneNumber}
                    </Typography>
                    <Typography sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "'Jersey 15', sans-serif",
                      fontSize: '0.8rem'
                    }}>
                      {orderInfo.isGift ? orderInfo.giftRecipient.address : orderInfo.address}
                    </Typography>
                  </Box>
                )}

                {/* Payment Method n */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}>
                  <Typography sx={{
                    color: "white",
                    fontFamily: "'Jersey 15', sans-serif",

                  }}>
                    Payment Method:
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: "white",
                    gap: 1
                  }}>
                    {paymentMethods[orderInfo.paymentMethod]?.icon}
                    <Typography >
                      {paymentMethods[orderInfo.paymentMethod]?.name || 'Not selected'}
                    </Typography>
                  </Box>
                </Box>

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
                          <LocalOfferIcon sx={{ color: 'white' }} />
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

                {/* Gift Status */}
                {orderInfo.isGift && (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    alignItems: 'center'
                  }}>
                    <Typography sx={{ color: "white", fontFamily: "'Jersey 15', sans-serif" }}>
                      Gift:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#FFD700',
                      gap: 1
                    }}>
                      <CardGiftcardIcon />
                      <Typography>Yes</Typography>
                    </Box>
                  </Box>
                )}

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
                      ${subtotal.toFixed(2)}
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
                      ${totalWithShipping.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Checkout Buttons */}
                <ButtonCus
                  variant="button-pixel-green"
                  width="100%"
                  height="40px"
                  onClick={handleCheckout}
                  disabled={
                    isLoading ||
                    checkoutLoading ||
                    cartItems.length === 0 ||
                    (orderInfo.isGift ?
                      (!orderInfo.giftRecipient.fullName || !orderInfo.giftRecipient.phoneNumber || !orderInfo.giftRecipient.address) :
                      (!orderInfo.fullName || !orderInfo.phoneNumber || !orderInfo.address)
                    )
                  }
                >
                  {checkoutLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                      Place Order
                    </Typography>
                  )}
                </ButtonCus>

                {/* Display checkout error if any */}
                {checkoutError && (
                  <Typography sx={{ color: 'red', mt: 2, textAlign: 'center', fontSize: '0.9rem' }}>
                    {checkoutError}
                  </Typography>
                )}

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
      <OrderInfoDialog
        open={openOrderDialog}
        onClose={handleCloseOrderDialog}
        orderInfo={orderInfo}
        handleOrderInfoChange={handleOrderInfoChange}
        handleGiftToggle={handleGiftToggle}
        profileLoading={profileLoading}
        profileError={profileError}
      />
    </>
  );
};

export default CartPage;