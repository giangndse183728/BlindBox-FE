import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import ButtonCus from '../../components/Button/ButtonCus';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import useSocket, { SOCKET_EVENTS } from '../../utils/useSocket';
import { toast } from 'react-toastify';
import { fetchProfile } from '../../services/userApi';

const accNumber = process.env.REACT_APP_ACC;
const bankName = process.env.REACT_APP_BANK_NAME;

const OrderSuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  
  // Get data from location state
  const responseData = location.state?.orderData;
  const paymentMethod = location.state?.paymentMethod;
  
  // States for user data and loading
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);
  
  // Fetch user data from API
  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        // Get token from localStorage
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        if (storedToken) {
          // Fetch user data from API
          const userData = await fetchProfile();
          console.log("User data from API:", userData);
          
          // Update user info state with necessary fields
          setUserInfo({
            _id: userData._id,
            userName: userData.userName,
            email: userData.email,
            isSeller: userData.isRegisterSelling,
            verify: userData.verify
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Could not load user information");
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserData();
  }, []);
  
  // Initialize socket connection with error handling
  const { socket, isConnected, error } = useSocket(token, userInfo);
  
  // Handle different API response structures
  let orders = [];
  let orderGroupId = '';
  
  if (responseData) {
    if (responseData.orders) {
      // Original structure with multiple orders
      orders = responseData.orders;
      orderGroupId = responseData.orderGroupId;
    } else if (responseData.result) {
      // New structure with single order in result
      const singleOrder = responseData.result;
      orders = [singleOrder];
      orderGroupId = singleOrder._id; 
    }
  }
  
  // Use the first order for display if available
  const firstOrder = orders.length > 0 ? orders[0] : null;
  
  // Calculate total price from all orders
  const totalPrice = orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
  
  // Generate QR code for bank transfer
  const amount = Math.round(totalPrice * 1000);
  const description = `orderId ${orderGroupId}`; 
  const qrUrl = `https://qr.sepay.vn/img?acc=${accNumber}&bank=${bankName}&amount=${amount}&des=${encodeURIComponent(description)}&lock=true`;

  // Track socket errors
  useEffect(() => {
    if (error) {
      console.error("Socket error:", error);
      setSocketError(error);
    }
  }, [error]);
  
  // Improved socket connection logging
  useEffect(() => {
    console.log("Socket connection check:", {
      socketExists: !!socket,
      isConnected: isConnected,
      error: error
    });
    
    if (socket) {
      // Log socket details safely with null checks
      console.log("Socket details:", {
        id: socket?.id || 'undefined',
        connected: socket?.connected || false,
        namespace: socket?.nsp || 'unknown'
      });
    }
    
    // If socket exists but not connected, try reconnecting
    if (socket && !isConnected && token && userInfo) {
      console.log("Attempting manual socket reconnection");
      
      // Try forcing a reconnection
      try {
        socket.connect();
        
        // Add a delay and check connection again
        setTimeout(() => {
          console.log("Reconnection check:", {
            id: socket?.id || 'still undefined',
            connected: socket?.connected || false
          });
        }, 1000);
      } catch (err) {
        console.error("Socket reconnection error:", err);
      }
    }
  }, [socket, isConnected, token, userInfo, error]);
  
  // Update the socket event listeners to handle possible undefined socket
  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    
    if (!isConnected) {
      console.error("Socket is not connected");
      return;
    }
    
    console.log("Setting up socket event listeners");
    console.log("Current socket state:", {
      id: socket?.id || 'undefined',
      connected: socket?.connected || false
    });
    
    // First, remove any existing listeners to avoid duplicates
    socket.off(SOCKET_EVENTS.ORDER_SUCCESS);
     
    // Set up the ORDER_SUCCESS listener
    if (paymentMethod === 'banking' && orderGroupId) {
      console.log("Setting up ORDER_SUCCESS listener for payment confirmation");
      
      socket.on(SOCKET_EVENTS.ORDER_SUCCESS, (data) => {
        console.log("ORDER_SUCCESS event received:", data);
        
        setPaymentStatus('confirmed');   
        toast.success("Payment received! Your order is now being processed.", {
          icon: "💰",
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: true
        });
      });
      
      // Test if toast is working
      setTimeout(() => {
        toast.info("Socket connection established", {
          position: "bottom-right",
          autoClose: 3000
        });
      }, 1000);
    }
    
    // Return cleanup function
    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off(SOCKET_EVENTS.ORDER_SUCCESS);
    };
  }, [socket, orderGroupId, paymentMethod, isConnected]);

  // Redirect if no order data
  useEffect(() => {
    if (!responseData || orders.length === 0) {
      navigate('/');
    }
  }, [responseData, orders, navigate]);

  if (!responseData || orders.length === 0 || isLoading) {
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
          {isLoading ? "Loading..." : "Redirecting..."}
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
              
              {/* Payment status */}
              {paymentMethod === 'banking' && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: paymentStatus === 'confirmed' ? '#4CAF50' : 'orange',
                    mt: 1,
                    fontWeight: 'bold'
                  }}
                >
                  {paymentStatus === 'confirmed' 
                    ? "✓ Payment Confirmed" 
                    : "Awaiting Payment Confirmation"}
                </Typography>
              )}
              
              {/* Socket connection status */}
              {paymentMethod === 'banking' && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isConnected ? 'rgba(255, 255, 255, 0.7)' : '#FF6B6B',
                    mt: 1,
                    fontSize: '0.85rem'
                  }}
                >
                  {isConnected 
                    ? "✓ Connected to payment notification system" 
                    : "⚠️ Notifications system disconnected - please check in my orders"}
                </Typography>
              )}
              
              {/* Socket error */}
              {socketError && paymentMethod === 'banking' && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#FF6B6B',
                    mt: 0.5,
                    fontSize: '0.8rem'
                  }}
                >
                  Error: {socketError}
                </Typography>
              )}
            </Box>

            {/* QR Code section - show only if payment not yet confirmed */}
            {paymentMethod === 'banking' && paymentStatus === 'pending' && (
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
                    OrderID:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                    {orderGroupId}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Date:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: 'white' }}>
                    {formatDate(firstOrder.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Status:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{
                    color: firstOrder.status === 4 ? '#FF5252' : '#4CAF50',
                    fontWeight: 'bold'
                  }}>
                    {getOrderStatusText(firstOrder.status)}
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
                    ${totalPrice.toFixed(2)}
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
                {firstOrder && firstOrder.receiverInfo ? firstOrder.receiverInfo.fullName : ''}
              </Typography>
              <Typography sx={{ color: 'white', mb: 1 }}>
                {firstOrder && firstOrder.receiverInfo ? firstOrder.receiverInfo.phoneNumber : ''}
              </Typography>
              <Typography sx={{ color: 'white' }}>
                {firstOrder && firstOrder.receiverInfo ? firstOrder.receiverInfo.address : ''}
              </Typography>
            </Box>

            {/* Order Items - Show all items from all orders */}
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

              {orders.map((order, orderIndex) => (
                <React.Fragment key={`order-${orderIndex}`}>
                  {orderIndex > 0 && (
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        mt: 3, 
                        mb: 2,
                        fontStyle: 'italic'
                      }}
                    >
                      Order #{orderIndex + 1} from Seller ID: {order.items && order.items[0] ? order.items[0].sellerId : 'Unknown'}
                    </Typography>
                  )}
                  
                  {(order.items || []).map((item, itemIndex) => (
                    <Box key={`order-${orderIndex}-item-${itemIndex}`} sx={{
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
                          objectFit: 'contain',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
                </React.Fragment>
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
                  ${totalPrice.toFixed(2)}
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