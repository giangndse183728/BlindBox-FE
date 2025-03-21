import React from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import ButtonCus from '../../components/Button/ButtonCus';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useEffect } from 'react';

const accNumber = process.env.REACT_APP_ACC;
const bankName = process.env.REACT_APP_BANK_NAME;

const OrderSuccessScreen = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;
  const paymentMethod = location.state?.paymentMethod;
  const amount = Math.round(orderData.totalPrice * 1000);
  const description = `orderId ${orderData._id}`; 

    const qrUrl = `https://qr.sepay.vn/img?acc=${accNumber}&bank=${bankName}&amount=${amount}&des=${encodeURIComponent(description)}&lock=true`;

  // If no order data is found, redirect to home
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "url(/assets/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <Typography
          variant="h5"
          fontFamily="'Jersey 15', sans-serif"
          sx={{ color: "white" }}
        >
          Redirecting...
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentMethodIcon = () => {
    return paymentMethod === 'cod' ? <LocalShippingIcon /> : <AccountBalanceIcon />;
  };

  const getPaymentMethodName = () => {
    return paymentMethod === 'cod' ? 'Cash On Delivery' : 'Bank Transfer';
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      0: 'Pending',
      1: 'Processing',
      2: 'Shipped',
      3: 'Delivered',
      4: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      pt: 10,
      pb: 5,
      px: 3,
      backgroundImage: "url(/assets/background.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
              <Typography
                variant="h4"
                fontFamily="'Jersey 15', sans-serif"
                sx={{
                  color: "white",
                  ...yellowGlowAnimation,
                  mb: 1
                }}
              >
                Order Placed Successfully!
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Thank you for your purchase. Your order has been received.
              </Typography>
            </Box>

            {paymentMethod === 'banking' && (
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h6"
                  fontFamily="'Jersey 15', sans-serif"
                  sx={{
                    color: "#FFD700",
                    mb: 2
                  }}
                >
                  Scan QR Code to Pay
                </Typography>
                <img
                  src={qrUrl}
                  alt="Payment QR Code"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}

            {/* Order Details */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontFamily="'Jersey 15', sans-serif"
                sx={{
                  color: "#FFD700",
                  mb: 2,
                  borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                  pb: 1
                }}
              >
                Order Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Order ID:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                    {orderData._id}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Date:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: 'white' }}>
                    {formatDate(orderData.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Status:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{
                    color: orderData.status === 4 ? '#FF5252' : '#4CAF50',
                    fontWeight: 'bold'
                  }}>
                    {getOrderStatusText(orderData.status)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Payment Method:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPaymentMethodIcon()}
                    <Typography sx={{ color: 'white' }}>
                      {getPaymentMethodName()}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Amount:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                    ${orderData.totalPrice.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Shipping Information */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontFamily="'Jersey 15', sans-serif"
                sx={{
                  color: "#FFD700",
                  mb: 2,
                  borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                  pb: 1
                }}
              >
                Shipping Information
              </Typography>

              <Typography sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                {orderData.receiverInfo.fullName}
              </Typography>
              <Typography sx={{ color: 'white', mb: 1 }}>
                {orderData.receiverInfo.phoneNumber}
              </Typography>
              <Typography sx={{ color: 'white' }}>
                {orderData.receiverInfo.address}
              </Typography>
            </Box>

            {/* Order Items */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontFamily="'Jersey 15', sans-serif"
                sx={{
                  color: "#FFD700",
                  mb: 2,
                  borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                  pb: 1
                }}
              >
                Order Items
              </Typography>

              {orderData.items.map((item, index) => (
                <Box key={index} sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <img
                    src={item.image}
                    alt={item.productName}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                      {item.productName}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                        Qty: {item.quantity}
                      </Typography>
                      <Typography sx={{ color: '#FFD700' }}>
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant="h6"
                  fontFamily="'Jersey 15', sans-serif"
                  sx={{ color: 'white' }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  fontFamily="'Jersey 15', sans-serif"
                  sx={{ color: '#FFD700' }}
                >
                  ${orderData.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Link to="/Collection-page" style={{ textDecoration: 'none' }}>
                <ButtonCus
                  variant="button-pixel"
                  width="180px"
                  height="40px"
                >
                  <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                    Continue Shopping
                  </Typography>
                </ButtonCus>
              </Link>

              <Link to="/my-orders" style={{ textDecoration: 'none' }}>
                <ButtonCus
                  variant="button-pixel-green"
                  width="180px"
                  height="40px"
                >
                  <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                    View My Orders
                  </Typography>
                </ButtonCus>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSuccessScreen; 