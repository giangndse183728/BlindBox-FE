import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Collapse, IconButton, Chip,
    Tabs, Tab, Pagination, Divider, TextField, InputAdornment, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { getMyOrders, completeOrderStatus, cancelOrder } from '../../services/ordersApi';
import GlassCard from '../../components/Decor/GlassCard';
import ButtonCus from "../../components/Button/ButtonCus";
import OrderStatusStepper from '../../components/Order/OrderStatusStepper';
import { toast } from 'react-toastify';
import OrderPdfExport from '../../components/Order/OrderPdfExport';
import { createFeedback } from '../../services/feedbackApi';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ProductFeedbackForm from './ProductFeedbackForm';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCodeIcon from '@mui/icons-material/QrCode';

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
    // Add a fallback for any unexpected status values
    default: { label: 'Unknown', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.2)', icon: <PendingIcon /> }
};

const ITEMS_PER_PAGE = 5;

const accNumber = process.env.REACT_APP_ACC;
const bankName = process.env.REACT_APP_BANK_NAME;

// Helper function to safely get status info
const getStatusInfo = (status) => {
    return ORDER_STATUS[status] || ORDER_STATUS.default;
};

function OrderRow({ order, onOrderUpdate }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [selectedProductForFeedback, setSelectedProductForFeedback] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [hasFeedback, setHasFeedback] = useState(false);

    // Pre-defined cancellation reasons
    const cancelReasons = [
        "Changed my mind",
        "Found a better deal elsewhere",
        "Ordered by mistake",
        "Shipping will take too long",
        "Financial reasons",
        "Issues with payment method",
        "Other"
    ];

    // Generate QR code URL for banking payment
    const generateQRCodeUrl = () => {
        const amount = Math.round(order.totalPrice * 1000);
        const description = `orderId ${order._id}`; 
        return `https://qr.sepay.vn/img?acc=${accNumber}&bank=${bankName}&amount=${amount}&des=${encodeURIComponent(description)}`;
    };

    // Get the cancellation reason from status history if available
    const getCancellationReason = () => {
        if (order.status === 4 && order.statusHistory && order.statusHistory.length > 0) {
            // Find the most recent status 4 entry in the history
            const cancelEntry = order.statusHistory.find(entry => entry.status === 4);
            return cancelEntry ? cancelEntry.reason : 'No reason provided';
        }
        return null;
    };

    const cancellationReason = getCancellationReason();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            setLoading(true);
            
            // Create a status history entry locally before the API call
            const statusHistoryEntry = {
                status: 3, // Completed status
                timestamp: new Date().toISOString()
            };
            
            // Update the order locally first for instant feedback
            onOrderUpdate(orderId, 3, statusHistoryEntry);
            
            // Then make the API call
            await completeOrderStatus(orderId);
            
            // Refresh the orders from the server to ensure sync
            onOrderUpdate();
        } catch (error) {
            console.error('Error completing order:', error);
            toast.error('Failed to complete order');
            // Refresh to get the correct state if error
            onOrderUpdate();
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCancelDialog = () => {
        setShowCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setShowCancelDialog(false);
        setCancelReason('');
    };

    const handleCancelOrder = async (orderId) => {
        try {
            if (!cancelReason) {
                toast.error("Please select a reason for cancellation");
                return;
            }

            setLoading(true);
            
            // Create a status history entry locally for instant feedback
            const statusHistoryEntry = {
                status: 4, // Cancelled status
                timestamp: new Date().toISOString(),
                reason: cancelReason
            };
            
            // Update the order locally first for instant feedback
            onOrderUpdate(orderId, 4, statusHistoryEntry);
            
            // Then make the API call
            await cancelOrder(orderId, { reason: cancelReason });
            
            handleCloseCancelDialog();
            
            // Refresh orders from the server
            onOrderUpdate();
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.message || "Failed to cancel order");
            // Refresh to get the correct state if error
            onOrderUpdate();
        } finally {
            setLoading(false);
        }
    };

    // Check if the order already has feedback
    useEffect(() => {
        // If the order has a feedback property, set hasFeedback to true
        if (order.feedback) {
            setHasFeedback(true);
        }
    }, [order]);

    // Modify the handleOpenFeedbackDialog to take a product
    const handleOpenFeedbackDialog = (product) => {
        setSelectedProductForFeedback(product);
        setShowFeedbackDialog(true);
    };

    const handleCloseFeedbackDialog = () => {
        setShowFeedbackDialog(false);
        setSelectedProductForFeedback(null);
    };

    const handleFeedbackSuccess = () => {
        // Refresh orders to show updated feedback status
        onOrderUpdate();
    };

    // Add a function to check if a product already has feedback
    const hasProductFeedback = (productId) => {
        if (!order.feedbacks || !Array.isArray(order.feedbacks)) {
            return false;
        }
        return order.feedbacks.some(feedback => feedback.productId === productId);
    };

    // QR code dialog handlers
    const handleOpenQRCode = () => {
        setShowQRCode(true);
    };

    const handleCloseQRCode = () => {
        setShowQRCode(false);
    };

    // Get individual item status for partially confirmed/processed orders
    const getItemStatus = (item) => {
        // For partially confirmed/processed/completed/cancelled orders (status 5-8)
        if (order.status >= 5 && order.status <= 8) {
            // Look in the status history for confirmed items
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
            
            // If we can't determine from history, check item's direct status if available
            return item.status !== undefined ? ORDER_STATUS[item.status]?.label || 'Unknown' : 'Unknown';
        }
        
        // For regular orders, all items have the same status
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

    // Helper function to map order status to stepper steps for the visual display
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
                <TableCell colSpan={6}>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                                Order ID: {order._id}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={getStatusInfo(order.status).label}
                                    sx={{
                                        bgcolor: getStatusInfo(order.status).bgColor,
                                        color: getStatusInfo(order.status).color,
                                        border: `1px solid ${getStatusInfo(order.status).color}`,
                                        fontWeight: 'bold',
                                    }}
                                    icon={<Box sx={{ '& svg': { color: getStatusInfo(order.status).color, fontSize: '1rem', mr: -0.5 } }}>{getStatusInfo(order.status).icon}</Box>}
                                />

                                {/* Show payment method chip */}
                                <Chip
                                    label={order.paymentMethod === 0 ? "COD" : "Banking"}
                                    size="small"
                                    icon={order.paymentMethod === 0 ? <LocalShippingIcon sx={{ fontSize: '1rem' }} /> : <AccountBalanceIcon sx={{ fontSize: '1rem' }} />}
                                    sx={{
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                    }}
                                />

                                {/* Show QR code button for pending banking payments */}
                                {order.status === 0 && order.paymentMethod === 1 && (
                                    <IconButton 
                                        size="small" 
                                        onClick={handleOpenQRCode}
                                        sx={{ 
                                            color: '#FFD700',
                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                            border: '1px solid rgba(255, 215, 0, 0.3)',
                                            p: 0.5,
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 215, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        <QrCodeIcon sx={{ fontSize: '1.2rem' }} />
                                    </IconButton>
                                )}

                                {/* Show cancellation reason in a secondary chip if applicable */}
                                {order.status === 4 && cancellationReason && (
                                    <Chip
                                        label={cancellationReason}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            border: '1px solid rgba(244, 67, 54, 0.3)',
                                            fontStyle: 'italic',
                                            ml: 1
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.2)', pb: 1 }}>
                                Order Items ({order.items.length})
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                {order.items.map((item) => (
                                    <Box 
                                        key={item._id} 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                                            borderRadius: 1, 
                                            p: 2, 
                                            mb: 1,
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            '&:hover': {
                                                borderColor: 'rgba(255, 215, 0, 0.3)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)'
                                            }
                                        }}
                                    >
                                        <Link
                                            to={`/product/${item.slug || item.productSlug}?id=${item.productId}`}
                                            style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
                                        >
                                            <Box 
                                                component="img" 
                                                src={item.image} 
                                                alt={item.productName} 
                                                sx={{ 
                                                    width: 60, 
                                                    height: 60, 
                                                    objectFit: 'cover', 
                                                    borderRadius: 1, 
                                                    mr: 2,
                                                    cursor: 'pointer'
                                                }} 
                                            />
                                        </Link>
                                        <Box sx={{ 
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: {xs: 'column', sm: 'row'},
                                            alignItems: {xs: 'flex-start', sm: 'center'},
                                            justifyContent: 'space-between'
                                        }}>
                                            <Box>
                                                <Link
                                                    to={`/product/${item.slug || item.productSlug}?id=${item.productId}`}
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    <Typography sx={{ 
                                                        color: 'white', 
                                                        fontWeight: 'bold',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            color: '#FFD700',
                                                        }
                                                    }}>
                                                        {item.productName}
                                                    </Typography>
                                                </Link>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                                    ${parseFloat(item.price).toFixed(2)} 
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                                    {formatDate(order.createdAt)}
                                                </Typography>

                                                {/* Display individual item status for partially confirmed orders */}
                                                {order.status >= 5 && order.status <= 8 && (
                                                    <Chip 
                                                        label={getItemStatus(item)}
                                                        size="small"
                                                        sx={{
                                                            mt: 1,
                                                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                                                            color: getItemStatusColor(item),
                                                            border: `1px solid ${getItemStatusColor(item)}`,
                                                            fontWeight: 'bold',
                                                        }}
                                                    />
                                                )}

                                                {/* Existing feedback section */}
                                                {order.status === 3 && (
                                                    <Box sx={{ mt: 1 }}>
                                                        {hasProductFeedback(item.productId) ? (
                                                            <Chip
                                                                icon={<StarIcon sx={{ color: '#FFD700 !important' }} />}
                                                                label="Reviewed"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                                                                    color: '#FFD700',
                                                                    border: '1px solid rgba(255, 215, 0, 0.5)',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            />
                                                        ) : (
                                                            <ButtonCus
                                                                variant="button-pixel-blue"
                                                                width="130px"
                                                                height="30px"
                                                                onClick={() => handleOpenFeedbackDialog(item)}
                                                                disabled={loading}
                                                                sx={{ fontSize: '0.8rem' }}
                                                            >
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <RateReviewIcon sx={{ fontSize: '1rem' }} />
                                                                    <Typography variant="body2" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                                                        Rate Product
                                                                    </Typography>
                                                                </Box>
                                                            </ButtonCus>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                mt: {xs: 1, sm: 0}
                                            }}>
                                                <Chip
                                                    label={`x${item.quantity}`}
                                                    size="small"
                                                    sx={{
                                                        mr: 2,
                                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                        color: 'white',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        minWidth: '45px'
                                                    }}
                                                />
                                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            
                            {/* Summary row */}
                            <Box sx={{ 
                                mt: 2, 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                alignItems: 'center',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                pt: 2
                            }}>
                                {order.discount && (
                                    <Typography sx={{ color: '#F44336', fontSize: '1rem', mr: 2 }}>
                                        Discount: -${parseFloat(order.discount).toFixed(2)}
                                    </Typography>
                                )}
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    Total: ${parseFloat(order.totalPrice).toFixed(2)}
                                </Typography>
                                <IconButton 
                                    aria-label="expand row" 
                                    size="medium" 
                                    onClick={() => setOpen(!open)} 
                                    sx={{ ml: 2, color: 'white' }}
                                >
                                    {open ? <KeyboardArrowUpIcon fontSize="large" /> : <KeyboardArrowDownIcon fontSize="large" />}
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                        
                            <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mt: 2, mb: 2 }}>Order Details</Typography>
                            
                            {/* Use the mapping function for the stepper to display partial statuses at their main step */}
                            <OrderStatusStepper status={getStepperStatus(order.status)} />

                            {/* Simplified Status History Timeline */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    my: 2,
                                    px: 2,
                                    py: 1.5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                    borderRadius: 1,
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <Typography variant="subtitle1" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 0.5 }}>
                                        Order Timeline
                                    </Typography>
                                    
                                    {/* Sort by timestamp in descending order and map to simple timeline items */}
                                    {[...order.statusHistory]
                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                        .map((entry, index) => {
                                            const statusInfo = getStatusInfo(entry.status);
                                            return (
                                                <Box 
                                                    key={index}
                                                    sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                        borderBottom: index < order.statusHistory.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                                        pb: index < order.statusHistory.length - 1 ? 1 : 0
                                                    }}
                                                >
                                                    {/* Colored dot for status */}
                                                    <Box 
                                                        sx={{ 
                                                            width: 10, 
                                                            height: 10, 
                                                            borderRadius: '50%', 
                                                            bgcolor: statusInfo.color,
                                                            flexShrink: 0
                                                        }} 
                                                    />
                                                    
                                                    {/* Status text */}
                                                    <Typography 
                                                        sx={{ 
                                                            color: statusInfo.color, 
                                                            fontWeight: 'medium',
                                                            fontSize: '0.9rem',
                                                            flexShrink: 0,
                                                            minWidth: '100px'
                                                        }}
                                                    >
                                                        {statusInfo.label}
                                                    </Typography>
                                                    
                                                    {/* Timestamp */}
                                                    <Typography 
                                                        sx={{ 
                                                            color: 'rgba(255, 255, 255, 0.7)', 
                                                            fontSize: '0.9rem',
                                                            flexGrow: 1
                                                        }}
                                                    >
                                                        {formatDate(entry.timestamp)}
                                                    </Typography>
                                                    
                                                    {/* Reason (if present) - only for cancelled status */}
                                                    {entry.status === 4 && entry.reason && (
                                                        <Chip
                                                            label={entry.reason}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                                color: 'rgba(255, 255, 255, 0.8)',
                                                                border: '1px solid rgba(244, 67, 54, 0.3)',
                                                                fontStyle: 'italic',
                                                                fontSize: '0.75rem',
                                                                height: 24
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            );
                                        })}
                                </Box>
                            )}

                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'end', mb:3, gap: 2}}>                          
                                {/* PDF Export for completed orders */}
                                {order.status === 3 && (
                                    <OrderPdfExport
                                        order={order}
                                        paymentMethod={order.paymentMethod === 0 ? 'cod' : 'banking'}
                                    />
                                )}
                                
                                {/* Complete button for processing orders */}
                                {order.status === 2 && (
                                    <ButtonCus
                                        variant="button-pixel-green"
                                        width="180px"
                                        height="40px"
                                        onClick={() => handleCompleteOrder(order._id)}
                                        disabled={loading}
                                    >
                                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                            Confirm Completion
                                        </Typography>
                                    </ButtonCus>
                                )}

                                {/* Cancel button ONLY for pending orders */}
                                {order.status === 0 && (
                                    <ButtonCus
                                        variant="button-pixel-red"
                                        width="180px"
                                        height="40px"
                                        onClick={handleOpenCancelDialog}
                                        disabled={loading}
                                    >
                                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                            Cancel Order
                                        </Typography>
                                    </ButtonCus>
                                )}
                            </Box>
          

                            {/* Add cancellation reason detail section if applicable */}
                            {order.status === 4 && cancellationReason && (
                                <Box sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    borderRadius: 1,
                                    mb: 3,
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

                            <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1, mb: 3 }}>
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>Shipping Information</Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography sx={{ color: 'white' }}>Address: {order.receiverInfo.address}</Typography>
                                    <Typography sx={{ color: 'white' }}>Phone: {order.receiverInfo.phoneNumber}</Typography>
                                </Box>
                            </Box>
                            {order.notes && (
                                <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>Notes</Typography>
                                    <Typography sx={{ color: 'white', ml: 2 }}>{order.notes}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            {/* Cancel Order Dialog */}
            <Dialog
                open={showCancelDialog}
                onClose={handleCloseCancelDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 2,
                        maxWidth: '500px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#FFD700',
                    fontFamily: "'Jersey 15', sans-serif",
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    pb: 2
                }}>
                    Cancel Order
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Typography sx={{ color: 'white', mb: 2 }}>
                        Please select a reason for cancellation:
                    </Typography>

                    <FormControl fullWidth>
                        <Select
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Cancel reason' }}
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
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
                    <ButtonCus
                        variant="button-pixel"
                        width="120px"
                        height="40px"
                        onClick={handleCloseCancelDialog}
                        disabled={loading}
                    >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                            Back
                        </Typography>
                            </ButtonCus>
                    <ButtonCus
                        variant="button-pixel-red"
                        width="160px"
                        height="40px"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={loading || !cancelReason}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {loading ? (
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                            ) : (
                                <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                    Confirm Cancel
                                </Typography>
                            )}
                        </Box>
                    </ButtonCus>
                </DialogActions>
            </Dialog>

            {/* Add the feedback form component */}
            <ProductFeedbackForm 
                open={showFeedbackDialog}
                onClose={handleCloseFeedbackDialog}
                orderId={order._id}
                product={selectedProductForFeedback}
                onSuccess={handleFeedbackSuccess}
            />

            {/* QR Code Dialog for Banking Payments */}
            <Dialog
                open={showQRCode}
                onClose={handleCloseQRCode}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 2,
                        maxWidth: '400px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#FFD700',
                    fontFamily: "'Jersey 15', sans-serif",
                    borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                    pb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <QrCodeIcon /> Payment QR Code
                </DialogTitle>
                <DialogContent sx={{ py: 3, textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                        Order ID: {order._id}
                    </Typography>
                    <Typography sx={{ color: '#FFD700', fontSize: '1.2rem', mb: 2 }}>
                        Amount: ${order.totalPrice.toFixed(2)}
                    </Typography>
                    
                    <Box sx={{ my: 2 }}>
                        <img
                            src={generateQRCodeUrl()}
                            alt="Payment QR Code"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                padding: '8px'
                            }}
                        />
                    </Box>
                    
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mt: 2 }}>
                        Scan this QR code to complete your payment
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
                    <ButtonCus
                        variant="button-pixel"
                        width="120px"
                        height="40px"
                        onClick={handleCloseQRCode}
                    >
                        <Typography variant="body1" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                            Close
                        </Typography>
                    </ButtonCus>
                </DialogActions>
            </Dialog>

            {loading && (
                <TableRow>
                    <TableCell colSpan={6} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', py: 0.5 }}>
                        <CircularProgress size={24} sx={{ color: '#FFD700' }} />
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
}

export default function ManageMyOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState('all');
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getMyOrders();
            setOrders(response.result || []);
            setFilteredOrders(response.result || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let result = [...orders];

        // Apply tab filter with support for partial statuses
        if (tabValue !== 'all') {
            const statusValue = parseInt(tabValue);
            
            // For confirmed tab, include both confirmed and partially confirmed
            if (statusValue === 1) {
                result = result.filter(order => order.status === 1 || order.status === 6);
            }
            // For processing tab, include both processing and partially processing
            else if (statusValue === 2) {
                result = result.filter(order => order.status === 2 || order.status === 7);
            }
            // For completed tab, include both completed and partially completed
            else if (statusValue === 3) {
                result = result.filter(order => order.status === 3 || order.status === 8);
            }
            // For cancelled tab, include both cancelled and partially cancelled
            else if (statusValue === 4) {
                result = result.filter(order => order.status === 4 || order.status === 5);
            }
            // For pending, just use the regular status
            else {
                result = result.filter(order => order.status === statusValue);
            }
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order =>
                String(order._id || '').toLowerCase().includes(query) ||
                order.items.some(item => item.productName.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setFilteredOrders(result);
        setPage(1); // Reset to first page when filters change
    }, [orders, tabValue, searchQuery, sortOrder]);

    useEffect(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
    }, [filteredOrders, page]);

    const handleTabChange = (event, newValue) => setTabValue(newValue);
    const handlePageChange = (event, newPage) => setPage(newPage);
    const handleSearchChange = (event) => setSearchQuery(event.target.value);
    const handleSortOrderChange = (event) => setSortOrder(event.target.value);

    return (
        <>
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: "url(/assets/background.jpeg)", backgroundSize: "cover", backgroundPosition: "center", zIndex: -2 }} />
            <Box sx={{ padding: 4, marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
                <GlassCard style={{ width: '90%', padding: '30px' }}>
                    <Typography variant="h4" sx={{ fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', mb: 3 }}>My Orders 🗒️</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <TextField
                            placeholder="Search by order ID or product"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /></InputAdornment>),
                                sx: { color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' } }
                            }}
                        />
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                value={sortOrder}
                                onChange={handleSortOrderChange}
                                size="small"
                                IconComponent={() => <Box sx={{ display: 'none' }} />}
                                sx={{
                                    height: '50px',
                                    width: '150px',
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.2rem',
                                    backgroundColor: '#FFD700',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' }
                                }}
                            >
                                <MenuItem value="desc">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ArrowDownwardIcon /> Newest First
                                    </Box>
                                </MenuItem>
                                <MenuItem value="asc">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ArrowUpwardIcon /> Oldest First
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ width: '100%', mb: 2, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ '& .MuiTabs-indicator': { backgroundColor: '#FFD700' } }}>
                            <Tab
                                key="all"
                                label="All"
                                value="all"
                                sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                            />
                            <Tab
                                key="0"
                                label="Pending"
                                value="0"
                                sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                            />
                            {/* Group Confirmed and PartiallyConfirmed */}
                            <Tab
                                key="1"
                                label="Confirmed"
                                value="1"
                                sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                            />
                            {/* Group Processing and PartiallyProcessing */}
                            <Tab
                                key="2"
                                label="Processing"
                                value="2"
                                sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                            />
                            {/* Group Completed and PartiallyCompleted */}
                            <Tab
                                key="3"
                                label="Completed"
                                value="3"
                                sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                            />
                            {/* Group Cancelled and PartiallyCancelled */}
                            <Tab
                                key="4"
                                label="Cancelled"
                                value="4"
                                sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                            />
                        </Tabs>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress sx={{ color: '#FFD700' }} /></Box>
                    ) : error ? (
                        <Typography sx={{ color: 'white', textAlign: 'center' }}>{error}</Typography>
                    ) : filteredOrders.length === 0 ? (
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', my: 4 }}>{orders.length === 0 ? "No orders found" : "No orders found for this status"}</Typography>
                    ) : (
                        <>
                            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="60px" />
                                            <TableCell sx={{ color: '#FFD700', fontFamily: "'Jersey 15', sans-serif", fontSize: '1.5rem' }}>Order Items</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayedOrders.map((order) => (
                                            <React.Fragment key={order._id}>
                                                <OrderRow 
                                                    order={order} 
                                                    onOrderUpdate={(orderId, newStatus, statusHistoryEntry) => {
                                                        // If no parameters are provided, just fetch all orders
                                                        if (!orderId) {
                                                            fetchOrders();
                                                            return;
                                                        }
                                                        
                                                        // Otherwise update the order locally first for instant feedback
                                                        setOrders(prevOrders => 
                                                            prevOrders.map(o => {
                                                                if (o._id !== orderId) return o;
                                                                
                                                                const updatedOrder = {...o, status: newStatus};
                                                                
                                                                // Add the new status history entry if provided
                                                                if (statusHistoryEntry) {
                                                                    if (!updatedOrder.statusHistory) {
                                                                        updatedOrder.statusHistory = [statusHistoryEntry];
                                                                    } else {
                                                                        updatedOrder.statusHistory = [
                                                                            ...updatedOrder.statusHistory,
                                                                            statusHistoryEntry
                                                                        ];
                                                                    }
                                                                }
                                                                
                                                                return updatedOrder;
                                                            })
                                                        );
                                                    }}
                                                />
                                                {/* Add gap between orders */}
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ height: '20px', padding: 0, borderBottom: 'none' }} />
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 1 }}>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Showing {displayedOrders.length} of {filteredOrders.length} orders</Typography>
                                <Pagination
                                    count={Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE))}
                                    page={page}
                                    onChange={handlePageChange}
                                    sx={{ '& .MuiPaginationItem-root': { color: 'white' }, '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: 'rgba(255, 215, 0, 0.3)', borderColor: '#FFD700' }, '& .MuiPaginationItem-page:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                                />
                            </Box>
                        </>
                    )}
                </GlassCard>
            </Box>
        </>
    );
}