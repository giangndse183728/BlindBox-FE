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

const ORDER_STATUS = {
    0: { label: 'Pending', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
    1: { label: 'Confirmed', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', icon: <ReceiptIcon /> },
    2: { label: 'Processing', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', icon: <LocalShippingIcon /> },
    3: { label: 'Completed', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },
    4: { label: 'Cancelled', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> }
};

const ITEMS_PER_PAGE = 5;

function OrderRow({ order, onOrderUpdate }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

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
            await completeOrderStatus(orderId);
            onOrderUpdate();
        } catch (error) {
            console.error('Error completing order:', error);
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
            await cancelOrder(orderId, { reason: cancelReason });
            handleCloseCancelDialog();
            onOrderUpdate();
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.message || "Failed to cancel order");
        } finally {
            setLoading(false);
        }
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
                                label={ORDER_STATUS[order.status].label}
                                sx={{
                                    bgcolor: ORDER_STATUS[order.status].bgColor,
                                    color: ORDER_STATUS[order.status].color,
                                    border: `1px solid ${ORDER_STATUS[order.status].color}`,
                                    fontWeight: 'bold',
                                }}
                                icon={<Box sx={{ '& svg': { color: ORDER_STATUS[order.status].color, fontSize: '1rem', mr: -0.5 } }}>{ORDER_STATUS[order.status].icon}</Box>}
                            />

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
                                        <Box 
                                            component="img" 
                                            src={item.image} 
                                            alt={item.productName} 
                                            sx={{ 
                                                width: 60, 
                                                height: 60, 
                                                objectFit: 'cover', 
                                                borderRadius: 1, 
                                                mr: 2
                                            }} 
                                        />
                                        <Box sx={{ 
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: {xs: 'column', sm: 'row'},
                                            alignItems: {xs: 'flex-start', sm: 'center'},
                                            justifyContent: 'space-between'
                                        }}>
                                            <Box>
                                                <Typography sx={{ 
                                                    color: 'white', 
                                                    fontWeight: 'bold',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                }}>
                                                    {item.productName}
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                                    ${parseFloat(item.price).toFixed(2)} 
                                                </Typography>
                                                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                                                     {formatDate(order.createdAt)}
                                                </Typography>
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
                            <OrderStatusStepper status={order.status} />

                       
            
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'end', mb:3}}>
                    {order.status === 3 && (
                        <OrderPdfExport
                            order={order}
                            paymentMethod={order.paymentMethod === 0 ? 'cod' : 'banking'}
                        />
                    )}
                    
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

                    {order.status !== 4 && order.status !== 3 && (
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

        // Apply tab filter
        if (tabValue !== 'all') {
            result = result.filter(order => order.status === parseInt(tabValue));
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
                            {['all', 'Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map((label, index) => (
                                <Tab
                                    key={label}
                                    label={label}
                                    value={index === 0 ? 'all' : (index - 1).toString()}
                                    sx={{ color: 'white', '&.Mui-selected': { color: '#FFD700' }, fontFamily: "'Jersey 15', sans-serif", fontSize: '1.3rem' }}
                                />
                            ))}
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
                                                <OrderRow order={order} onOrderUpdate={fetchOrders} />
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