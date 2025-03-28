import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Collapse, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Pagination, Chip, Grid, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { toast } from 'react-toastify';
import GlassCard from "../../components/Decor/GlassCard";
import { getSellerOrders, updateOrderStatus } from '../../services/ordersApi';
import ButtonCus from "../../components/Button/ButtonCus";
import OrderStatusStepper from '../../components/Order/OrderStatusStepper';

const ORDER_STATUS = {
  0: { label: 'Pending', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
  1: { label: 'Confirmed', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', icon: <ReceiptIcon /> },
  2: { label: 'Processing', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', icon: <LocalShippingIcon /> },
  3: { label: 'Completed', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },
  4: { label: 'Cancelled', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> },
  5: { label: 'PartiallyCancelled', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> },
  6: { label: 'PartiallyConfirmed', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', icon: <ReceiptIcon /> },
  7: { label: 'PartiallyProcessing', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', icon: <LocalShippingIcon /> },
  8: { label: 'PartiallyCompleted', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },

  default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)', icon: <PendingIcon /> }
};

const PAYMENT_METHOD = {
  0: 'Cash On Delivery',
  1: 'Bank Transfer'
};

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          sx={{ 
            backgroundColor: '#FFD700', 
            color: 'black',
            '&:hover': { backgroundColor: '#E6C200' }
          }}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CancelOrderDialog({ open, onClose, onConfirm, loading }) {
  const [cancelReason, setCancelReason] = useState('');
  
  // Predefined reasons for sellers to cancel orders
  const cancelReasons = [
    "Out of stock",
    "Unable to fulfill order",
    "Pricing error",
    "Shipping restrictions",
    "Suspected fraudulent order",
    "Product discontinued",
    "Customer requested cancellation",
    "Other"
  ];

  const handleConfirm = () => {
    if (!cancelReason) {
      toast.error("Please select a reason for cancellation");
      return;
    }
    onConfirm(cancelReason);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 2,
          maxWidth: '500px',
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700' }}>
        Cancel Order
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
          Please select a reason for cancelling this order:
        </DialogContentText>
        
        <FormControl fullWidth>
          <Select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            displayEmpty
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': { 
                borderColor: 'rgba(255, 255, 255, 0.3)' 
              },
              '&:hover .MuiOutlinedInput-notchedOutline': { 
                borderColor: 'rgba(255, 255, 255, 0.5)' 
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                borderColor: '#FFD700' 
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }
              }
            }}
          >
            <MenuItem disabled value="">
              <em>Select a reason</em>
            </MenuItem>
            {cancelReasons.map((reason) => (
              <MenuItem 
                key={reason} 
                value={reason}
                sx={{ 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
                  '&.Mui-selected': { 
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.3)' }
                  }
                }}
              >
                {reason}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
          variant="outlined"
          disabled={loading}
        >
          Back
        </Button>
        <Button 
          onClick={handleConfirm} 
          sx={{ 
            backgroundColor: '#F44336', 
            color: 'white',
            '&:hover': { backgroundColor: '#d32f2f' },
            '&.Mui-disabled': { backgroundColor: 'rgba(244, 67, 54, 0.5)' }
          }}
          variant="contained"
          disabled={loading || !cancelReason}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            "Cancel Order"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OrderRow({ order, refreshOrders, updateOrderLocally }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localCancellationReason, setLocalCancellationReason] = useState(null);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCancellationReason = () => {

    if (localCancellationReason) {
      return localCancellationReason;
    }
    
    // Otherwise check the status history
    if (order.status === 4 && order.statusHistory && order.statusHistory.length > 0) {
      // Find the most recent status 4 entry in the history
      const cancelEntry = order.statusHistory.find(entry => entry.status === 4);
      return cancelEntry ? cancelEntry.reason : 'No reason provided';
    }
    return null;
  };

  const cancellationReason = getCancellationReason();

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      // Map numeric status to string commands for the API
      let statusCommand;
      switch (statusToUpdate) {
        case 1: statusCommand = "confirm"; break;
        case 2: statusCommand = "process"; break;
        case 3: statusCommand = "complete"; break;
        default: statusCommand = "confirm"; 
      }
      
      // Create a status history entry
      const statusHistoryEntry = {
        status: statusToUpdate,
        timestamp: new Date().toISOString()
      };
      
      // Optimistically update the UI before API call
      updateOrderLocally(order._id, statusToUpdate, null, statusHistoryEntry);
      
      await updateOrderStatus(order._id, statusCommand);

      toast.success(`Order ${ORDER_STATUS[statusToUpdate].label}`);
      
      setDialogOpen(false);
      setLoading(false);

    } catch (error) {
      refreshOrders(); 
      toast.error('Failed to update order status');
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleCancelOrder = async (reason) => {
    setLoading(true);
    try {
      // Save the reason locally first
      setLocalCancellationReason(reason);
      
      updateOrderLocally(order._id, 4, reason);
      
      await updateOrderStatus(order._id, "cancel", { reason });

      toast.success("Order cancelled successfully");
      
      setCancelDialogOpen(false);
      setLoading(false);

    } catch (error) {
      setLocalCancellationReason(null); 
      refreshOrders(); 
      toast.error('Failed to cancel order');
      setLoading(false);
      setCancelDialogOpen(false);
    }
  };

  const handleStatusClick = (status) => {
    if (status === 4) {
      setCancelDialogOpen(true);
    } else {
      setStatusToUpdate(status);
      setDialogOpen(true);
    }
  };

  const getItemStatus = (item) => {
    // Check if this is a partially confirmed order
    if (order.status >= 5 && order.status <= 8) {
      // Look for the item in the status history's confirmed items
      if (order.statusHistory && order.statusHistory.length > 0) {
        // Find the most recent status history entry with confirmedItems
        const statusEntry = order.statusHistory
          .filter(entry => entry.confirmedItems)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        if (statusEntry && statusEntry.confirmedItems) {
          // Check if this item is in the confirmed items list
          const isConfirmed = statusEntry.confirmedItems.some(
            confirmedItem => confirmedItem.productName === item.productName && 
                           confirmedItem.sellerId === item.sellerId
          );
          
          return isConfirmed ? 'Confirmed' : 'Pending';
        }
      }
      
      // If we can't determine status from history, check item's direct status
      return item.status !== undefined ? ORDER_STATUS[item.status]?.label || 'Unknown' : 'Unknown';
    }
    
    // For regular orders, all items have the same status as the order
    return ORDER_STATUS[order.status]?.label || 'Unknown';
  };

  const getItemStatusColor = (item) => {
    const status = getItemStatus(item);
    switch(status) {
      case 'Confirmed': return '#2196F3';
      case 'Processing': return '#9C27B0';
      case 'Completed': return '#4CAF50';
      case 'Cancelled': return '#F44336';
      case 'Pending': return '#FF9800';
      default: return '#757575';
    }
  };

  // Helper function to map order status to stepper steps
  const getStepperStatus = (status) => {
    // Map partially confirmed to confirmed step
    if (status === 6) return 1; // PartiallyConfirmed -> map to Confirmed (1)
    
    // Map partially processing to processing step
    if (status === 7) return 2; // PartiallyProcessing -> map to Processing (2)
    
    // Map partially completed to completed step
    if (status === 8) return 3; // PartiallyCompleted -> map to Completed (3)
    
    // Otherwise use the original status
    return status;
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'white' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: 'white' }}>{order._id}</TableCell>
        <TableCell sx={{ color: 'white' }}>{formatDate(order.createdAt)}</TableCell>
        <TableCell sx={{ color: 'white', textAlign: 'center' }}>
          ${parseFloat(order.totalPrice).toFixed(2)}
        </TableCell>
        <TableCell sx={{ color: 'white', textAlign: 'center' }}>
          {PAYMENT_METHOD[order.paymentMethod]}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={ORDER_STATUS[order.status].label}
              sx={{
                bgcolor: ORDER_STATUS[order.status].bgColor,
                color: ORDER_STATUS[order.status].color,
                border: `1px solid ${ORDER_STATUS[order.status].color}`,
                fontWeight: 'bold',
              }}
              icon={
                <Box sx={{ 
                  '& svg': { 
                    color: ORDER_STATUS[order.status].color,
                    fontSize: '1rem',
                    mr: -0.5
                  } 
                }}>
                  {ORDER_STATUS[order.status].icon}
                </Box>
              }
            />
            
            {/* Show cancellation reason if available */}
            {order.status === 4 && cancellationReason && (
              <Chip
                label={cancellationReason}
                size="small"
                sx={{
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  fontStyle: 'italic'
                }}
              />
            )}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 2 }}>
                Order Details
              </Typography>
              
              {/* Order Status Stepper - modified to map partial statuses to main steps */}
              <OrderStatusStepper status={getStepperStatus(order.status)} />

              {/* Status History Log Section */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: 1, 
                  mb: 3,
                  mt: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ReceiptIcon sx={{ mr: 1 }} /> Status History Log
                  </Typography>
                  
                  {[...order.statusHistory]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((entry, index) => {
                      const statusInfo = ORDER_STATUS[entry.status];
                      return (
                        <Box 
                          key={index} 
                          sx={{ 
                            mb: index < order.statusHistory.length - 1 ? 2 : 0,
                            pb: index < order.statusHistory.length - 1 ? 2 : 0,
                            borderBottom: index < order.statusHistory.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                          }}
                        >
                          {/* Status icon */}
                          <Box 
                            sx={{ 
                              backgroundColor: statusInfo.bgColor, 
                              color: statusInfo.color, 
                              borderRadius: '50%', 
                              width: 36, 
                              height: 36, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              mr: 2,
                              border: `1px solid ${statusInfo.color}`,
                              flexShrink: 0
                            }}
                          >
                            {statusInfo.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            {/* Status and timestamp */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography sx={{ color: statusInfo.color, fontWeight: 'bold' }}>
                                {statusInfo.label}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                                {formatDate(entry.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              )}

              {/* Previous Cancellation Reason Section */}
              {order.status === 4 && cancellationReason && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                  borderRadius: 1, 
                  mb: 3,
                  mt: 2,
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}>
                  <Typography sx={{ color: '#F44336', fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                    <CancelIcon sx={{ mr: 1 }} /> Cancellation Reason
                  </Typography>
                  <Typography sx={{ color: 'white', ml: 2 }}>
                    {cancellationReason}
                  </Typography>
                  {order.statusHistory && order.statusHistory.find(entry => entry.status === 4)?.timestamp && (
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 2, mt: 1, fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Cancelled on: {formatDate(order.statusHistory.find(entry => entry.status === 4).timestamp)}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Status Update Buttons */}
              {order.status !== 4 && order.status !== 3 && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, mt: 2 }}>
                  {/* Show confirm buttons for pending or partially confirmed with remaining pending items */}
                  {(order.status === 0 || order.status === 6) && (
                    <>
                      <ButtonCus
                        variant="button-pixel-green"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(1)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Confirm Order
                        </Typography>
                      </ButtonCus>
                      <ButtonCus
                        variant="button-pixel-red"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(4)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Cancel Order
                        </Typography>
                      </ButtonCus>
                    </>
                  )}
                  {/* Show process buttons for confirmed or partially processing orders */}
                  {(order.status === 1 || order.status === 7) && (
                    <>
                      <ButtonCus
                        variant="button-pixel-blue"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(2)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Process Order
                        </Typography>
                      </ButtonCus>
                      <ButtonCus
                        variant="button-pixel-red"
                        width="180px"
                        height="40px"
                        onClick={() => handleStatusClick(4)}
                        disabled={loading}
                      >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                          Cancel Order
                        </Typography>
                      </ButtonCus>
                    </>
                  )}
                  {/* Show complete button for processing orders */}
                  {order.status === 2 && (
                    <ButtonCus
                      variant="button-pixel-green"
                      width="180px"
                      height="40px"
                      onClick={() => handleStatusClick(3)}
                      disabled={loading}
                    >
                      <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                        Complete Order
                      </Typography>
                    </ButtonCus>
                  )}
                  {loading && <CircularProgress size={24} sx={{ color: '#FFD700' }} />}
                </Box>
              )}
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: 1,
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                      Shipping Information
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ color: 'white' }}>
                        Recipient: {order.receiverInfo.fullName}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Phone: {order.receiverInfo.phoneNumber}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Address: {order.receiverInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 1 }}>
                Ordered Items
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Product</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'center' }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'center' }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'center' }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: 'right' }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box 
                              component="img" 
                              src={item.image} 
                              alt={item.productName}
                              sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                            />
                            <Typography sx={{ color: 'white' }}>
                              {item.productName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                          ${((item.price ? parseFloat(item.price) : 0).toFixed(2))}
                        </TableCell>
                        <TableCell sx={{ color: 'white', textAlign: 'center' }}>{item.quantity}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {order.status >= 5 && order.status <= 8 ? (
                            <Chip 
                              label={getItemStatus(item)}
                              sx={{
                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                color: getItemStatusColor(item),
                                border: `1px solid ${getItemStatusColor(item)}`,
                                fontWeight: 'bold',
                              }}
                            />
                          ) : null}
                        </TableCell>
                        <TableCell sx={{ color: 'white', textAlign: 'right' }}>
                          ${(item.price ? parseFloat(item.price) : 0) * (item.quantity || 1).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} sx={{ color: '#FFD700', textAlign: 'right', fontWeight: 'bold' }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ color: '#FFD700', textAlign: 'right', fontWeight: 'bold' }}>
                        ${(order.totalPrice ? parseFloat(order.totalPrice) : 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {order.notes && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: 1,
                }}>
                  <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                    Notes
                  </Typography>
                  <Typography sx={{ color: 'white', ml: 2 }}>
                    {order.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Confirmation Dialog for Status Updates */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleStatusUpdate}
        title="Update Order Status"
        message={"Are you sure you want to update this order's status?"}
      />
      
      {/* Cancellation Dialog */}
      <CancelOrderDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelOrder}
        loading={loading}
      />
    </React.Fragment>
  );
}

export default function ManageSellerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {

    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  useEffect(() => {
    updateDisplayedOrders();
  }, [filteredOrders, page, itemsPerPage]);

  const fetchOrders = async () => {
 
    setLoading(true);
    try {
      const data = await getSellerOrders();
      setOrders(data.result);
      setFilteredOrders(data.result);
      filterOrders(data.result);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (ordersList = null) => {
    let filtered = [...(ordersList || orders)];
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(query) ||
        order.items.some(item => item.productName.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const statusValue = parseInt(statusFilter);
      filtered = filtered.filter(order => order.status === statusValue);
    }
    
    setFilteredOrders(filtered);
    
    setPage(1);
    
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    
  
    const startIndex = 0; 
    const endIndex = itemsPerPage;
    setDisplayedOrders(filtered.slice(startIndex, endIndex));
  };
  
  const updateDisplayedOrders = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <GlassCard style={{width:'100%', padding:'30px', marginTop: '20px'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Jersey 15', sans-serif", color:'whitesmoke' }}>
        Seller Order Management 🗒️
        </Typography>
      </Box>
      
      {/* Search and Filter Controls */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
      }}>
        <TextField
          placeholder="Search by order ID or product"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
            sx: {
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
            }
          }}
        />
        
        <FormControl 
          variant="outlined" 
          sx={{ 
            minWidth: 180,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FFD700',
            },
          }}
        >
          <InputLabel 
            id="status-filter-label" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': { color: '#FFD700' }
            }}
          >
            Status
          </InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
            IconComponent={FilterListIcon}
            sx={{ color: 'white' }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="0">Pending</MenuItem>
            <MenuItem value="1">Confirmed</MenuItem>
            <MenuItem value="6">Partially Confirmed</MenuItem>
            <MenuItem value="2">Processing</MenuItem>
            <MenuItem value="7">Partially Processing</MenuItem>
            <MenuItem value="3">Completed</MenuItem>
            <MenuItem value="8">Partially Completed</MenuItem>
            <MenuItem value="4">Cancelled</MenuItem>
            <MenuItem value="5">Partially Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
          {orders.length === 0 ? 
            "No orders found. Your products haven't been purchased yet." : 
            "No matching orders found for your search criteria."}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="60px" /> {/* Expand/collapse control */}
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order ID</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Total</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Payment Method</TableCell>
                  <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedOrders.map((order) => (
                  <OrderRow 
                    key={order._id} 
                    order={order} 
                    refreshOrders={fetchOrders}
                    updateOrderLocally={(orderId, newStatus, reason = null, statusHistoryEntry = null) => {
                      // Update function to create a statusHistory entry for any status change
                      const updateOrder = (o) => {
                        if (o._id !== orderId) return o;
                        
                        const updatedOrder = {...o, status: newStatus};
                        
                        // Create a history entry for any status change
                        let newHistoryEntry;
                        
                        // If a status history entry was provided, use it
                        if (statusHistoryEntry) {
                          newHistoryEntry = statusHistoryEntry;
                        } 
                        // For cancellations, include the reason
                        else if (newStatus === 4 && reason) {
                          newHistoryEntry = {
                            status: 4,
                            timestamp: new Date().toISOString(),
                            reason: reason
                          };
                        }
                        // For other status changes without a provided entry
                        else {
                          newHistoryEntry = {
                            status: newStatus,
                            timestamp: new Date().toISOString()
                          };
                        }
                        
                        // Create or update the statusHistory array
                        if (!updatedOrder.statusHistory) {
                          updatedOrder.statusHistory = [newHistoryEntry];
                        } else {
                          // If we already have an entry for this status, update it instead of adding a new one
                          const existingEntryIndex = updatedOrder.statusHistory.findIndex(
                            entry => entry.status === newStatus
                          );
                          
                          if (existingEntryIndex >= 0) {
                            // Update existing entry
                            const updatedStatusHistory = [...updatedOrder.statusHistory];
                            updatedStatusHistory[existingEntryIndex] = newHistoryEntry;
                            updatedOrder.statusHistory = updatedStatusHistory;
                          } else {
                            // Add new entry
                            updatedOrder.statusHistory = [...updatedOrder.statusHistory, newHistoryEntry];
                          }
                        }
                        
                        return updatedOrder;
                      };
                      
                      // Update all relevant state arrays
                      setOrders(prevOrders => prevOrders.map(updateOrder));
                      setFilteredOrders(prevOrders => prevOrders.map(updateOrder));
                      setDisplayedOrders(prevOrders => prevOrders.map(updateOrder));
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination Controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 3,
            px: 1
          }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Showing {displayedOrders.length} of {filteredOrders.length} orders
            </Typography>
            
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                  borderColor: '#FFD700',
                },
                '& .MuiPaginationItem-page:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            />
          </Box>
        </>
      )}
    </GlassCard>
  );
}