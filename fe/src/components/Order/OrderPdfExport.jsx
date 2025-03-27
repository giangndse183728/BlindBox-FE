import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Tooltip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { usePDF } from 'react-to-pdf';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ButtonCus from '../../components/Button/ButtonCus';

const OrderPdfExport = ({ order, paymentMethod }) => {
  // Only allow PDF export for completed orders (status 3)
  const isCompleted = order.status === 3;
  const disabled = !isCompleted;

  // Use the current API from react-to-pdf
  const { toPDF, targetRef } = usePDF({
    filename: `blindbox-receipt-${order._id}.pdf`,
    page: { margin: 20 },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1
    },
  });
  
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
      1: 'Confirmed',
      2: 'Processing',
      3: 'Completed',
      4: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  };

  // Find if there's a cancellation reason for this order
  const getCancellationReason = () => {
    if (order.status === 4 && order.statusHistory && order.statusHistory.length > 0) {
      const cancelEntry = order.statusHistory.find(entry => entry.status === 4);
      return cancelEntry ? cancelEntry.reason : null;
    }
    return null;
  };

  const cancellationReason = getCancellationReason();

  return (
    <>
      {/* Button to trigger PDF export */}
      <Tooltip title={disabled ? "Only completed orders can be exported" : "Export receipt to PDF"}>
        <span>
          <ButtonCus
            variant={disabled ? "button-pixel-disabled" : "button-pixel-blue"}
            width="180px"
            height="40px"
            onClick={disabled ? undefined : () => toPDF()}
            disabled={disabled}
            sx={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.7 : 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PictureAsPdfIcon />
              <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                Export Receipt
              </Typography>
            </Box>
          </ButtonCus>
        </span>
      </Tooltip>

      {/* Hidden content that will be exported to PDF */}
      <Box sx={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <Box ref={targetRef} sx={{ width: '210mm', p: 4, bgcolor: 'white', color: 'black' }}>
          {/* Header with Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3, 
            pb: 3, 
            borderBottom: '2px solid #FFD700'
          }}>
            {/* Logo and company name */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Logo */}
              <Box 
                component="img" 
                src="/assets/logoBB.png" 
                alt="BlindB!ox Logo" 
                sx={{ 
                  height: 70, 
                  mr: 2 
                }}
              />
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: "'Jersey 15', sans-serif",
                    color: '#000',
                    letterSpacing: '1px'
                  }}
                >
                  BlindB!ox
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Platform for Accessory & Mystery Boxes & Trading
                </Typography>
              </Box>
            </Box>
            
            {/* Receipt Information */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1,
                  color: '#555'
                }}
              >
                Order Receipt
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Generated: {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Order Summary - Top Section */}
          <Box sx={{ 
            bgcolor: '#F9F9F9', 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            border: '1px solid #eee'
          }}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Order ID:</Typography>
                <Typography sx={{ mt: 0.5 }}>{order._id}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Order Date:</Typography>
                <Typography sx={{ mt: 0.5 }}>{formatDate(order.createdAt)}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Payment Method:</Typography>
                <Typography sx={{ mt: 0.5 }}>{getPaymentMethodName()}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Status:</Typography>
                <Typography 
                  sx={{ 
                    mt: 0.5,
                    fontWeight: 'bold',
                    color: order.status === 3 ? '#4CAF50' : (order.status === 4 ? '#F44336' : '#2196F3')
                  }}
                >
                  {getOrderStatusText(order.status)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Customer & Shipping Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Left Column - Customer Details */}
            <Grid item xs={6}>
              <Paper elevation={1} sx={{ p: 3, height: '100%', border: '1px solid #eee' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#555', borderBottom: '2px solid #FFD700', pb: 1 }}>
                  Customer Information
                </Typography>
                
                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                  {order.receiverInfo?.fullName}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Phone: {order.receiverInfo?.phoneNumber}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Email: {order.receiverInfo?.email || "support@blindbox.com"}
                </Typography>
              </Paper>
            </Grid>
            
            {/* Right Column - Shipping Information */}
            <Grid item xs={6}>
              <Paper elevation={1} sx={{ p: 3, height: '100%', border: '1px solid #eee' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#555', borderBottom: '2px solid #FFD700', pb: 1 }}>
                  Shipping Information
                </Typography>
                
                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                  {order.receiverInfo?.fullName}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Phone: {order.receiverInfo?.phoneNumber}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Address: {order.receiverInfo?.address}
                </Typography>
                
                {order.notes && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', mt: 2, mb: 0.5, color: '#555' }}>
                      Order Notes:
                    </Typography>
                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                      "{order.notes}"
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Order Items */}
          <Paper elevation={1} sx={{ p: 3, mb: 4, border: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#555', borderBottom: '2px solid #FFD700', pb: 1 }}>
              Order Items
            </Typography>

            {/* Header Row */}
            <Box sx={{ 
              display: 'flex', 
              borderBottom: '2px solid #eee', 
              py: 1, 
              fontWeight: 'bold',
              color: '#555'
            }}>
              <Box sx={{ width: '50px' }}>#</Box>
              <Box sx={{ flex: 4 }}>Product</Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>Quantity</Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>Price</Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>Total</Box>
            </Box>
            
            {/* Items */}
            {order.items?.map((item, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  borderBottom: '1px solid #eee', 
                  py: 2,
                  alignItems: 'center',
                  bgcolor: index % 2 === 0 ? 'white' : '#f9f9f9'
                }}
              >
                <Box sx={{ width: '50px', color: '#777' }}>{index + 1}</Box>
                <Box sx={{ flex: 4, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: '#eee', 
                      borderRadius: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#777'
                    }}
                  >
                    IMG
                  </Box>
                  <Typography sx={{ fontWeight: 'medium' }}>
                    {item.productName}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  {item.quantity}
                </Box>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  ${parseFloat(item.price).toFixed(2)}
                </Box>
                <Box sx={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Box>
              </Box>
            ))}
            
            {/* Summary */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '2px solid #eee' }}>
              <Grid container spacing={1}>
                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1
                  }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Subtotal:</Typography>
                    <Typography>${order.totalPrice?.toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1
                  }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Shipping:</Typography>
                    <Typography>Free</Typography>
                  </Box>
                  
                  {order.discount && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1 
                    }}>
                      <Typography sx={{ fontWeight: 'bold', color: '#F44336' }}>Discount:</Typography>
                      <Typography sx={{ color: '#F44336' }}>-${parseFloat(order.discount).toFixed(2)}</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 2,
                    pt: 2,
                    borderTop: '2px solid #eee',
                    fontSize: '1.1rem'
                  }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Total:</Typography>
                    <Typography sx={{ fontWeight: 'bold', color: '#000' }}>
                      ${order.totalPrice?.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          {/* Cancellation Reason (if applicable) */}
          {cancellationReason && (
            <Paper elevation={1} sx={{ p: 3, mb: 4, border: '1px solid #f44336', bgcolor: '#fff8f8' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#f44336' }}>
                Order Cancelled
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Reason: {cancellationReason}
              </Typography>
              {order.statusHistory && order.statusHistory.find(entry => entry.status === 4)?.timestamp && (
                <Typography sx={{ color: '#777', fontSize: '0.9rem' }}>
                  Cancelled on: {formatDate(order.statusHistory.find(entry => entry.status === 4).timestamp)}
                </Typography>
              )}
            </Paper>
          )}

          {/* Footer */}
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '2px solid #FFD700', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontFamily: "'Jersey 15', sans-serif" }}>
              BlindB!ox
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Thank you for your purchase!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              For any questions, please contact our support team at support@blindbox.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, fontStyle: 'italic' }}>
              Discover the Mystery in Every Box
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OrderPdfExport;

// Adding Table components to avoid import issues
const Table = ({ children }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    {children}
  </table>
);

const TableHead = ({ children }) => (
  <thead>{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children }) => (
  <tr>{children}</tr>
);

const TableCell = ({ children, align, colSpan, sx }) => (
  <td 
    style={{ 
      padding: '8px', 
      borderBottom: sx?.borderBottom === 'none' ? 'none' : '1px solid #eee',
      textAlign: align || 'left',
      fontWeight: sx?.fontWeight || 'normal',
      fontSize: sx?.fontSize || 'inherit',
      color: sx?.color || 'inherit'
    }} 
    colSpan={colSpan}
  >
    {children}
  </td>
); 