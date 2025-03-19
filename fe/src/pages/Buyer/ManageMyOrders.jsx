import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Collapse, IconButton, Chip,
    Tabs, Tab, Pagination, Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { getMyOrders } from '../../services/ordersApi';
import GlassCard from '../../components/Decor/GlassCard';
import OrderStatusStepper from '../../components/Order/OrderStatusStepper';

// Define order status constants
const ORDER_STATUS = {
    0: { label: 'Pending', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
    1: { label: 'Processing', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', icon: <ReceiptIcon /> },
    2: { label: 'Shipped', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', icon: <LocalShippingIcon /> },
    3: { label: 'Delivered', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },
    4: { label: 'Cancelled', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> }
};

// Sub-component for each expandable row
function OrderRow({ order }) {
    const [open, setOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <React.Fragment>
            {/* Main Row: Order Items Card Section */}
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    {/* Removing the IconButton from here */}
                </TableCell>
                <TableCell colSpan={5}>
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
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.productName}
                                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        {item.productName}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                                        Variant: {item.variant || 'N/A'}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                                        x{item.quantity}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}
                        {/* Summary Section */}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            {order.discount && (
                                <Typography sx={{ color: '#F44336', fontSize: '0.9rem' }}>
                                    Combo Discount: -${parseFloat(order.discount).toFixed(2)}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem', mr: 1 }}>
                                    Total: ${parseFloat(order.totalPrice).toFixed(2)}
                                </Typography>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpen(!open)}
                                    sx={{ color: 'white' }}
                                >
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </TableCell>
            </TableRow>

            {/* Collapsible Row: Order Details + Additional Details */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            {/* Order Details (Order ID, Total Price, Status, Receiver, Order Date) */}
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="60px" /> {/* Empty cell to align with header */}
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order ID</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Total Price</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Status</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Receiver</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <TableCell width="60px" /> {/* Empty cell to align with header */}
                                        <TableCell sx={{ color: 'white', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{order._id}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>${parseFloat(order.totalPrice).toFixed(2)}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
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
                                                            mr: -0.5,
                                                        },
                                                    }}>
                                                        {ORDER_STATUS[order.status].icon}
                                                    </Box>
                                                }
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>{order.receiverInfo.fullName}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{formatDate(order.createdAt)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {/* Additional Details (Status Stepper, Shipping, Notes) */}
                            <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mt: 2, mb: 2 }}>
                                Order Details
                            </Typography>

                            {/* Order Status Stepper */}
                            <OrderStatusStepper status={order.status} />

                            {/* Shipping Information */}
                            <Box sx={{
                                p: 2,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: 1,
                                mb: 3,
                            }}>
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                                    Shipping Information
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography sx={{ color: 'white' }}>
                                        Address: {order.receiverInfo.address}
                                    </Typography>
                                    <Typography sx={{ color: 'white' }}>
                                        Phone: {order.receiverInfo.phoneNumber}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Additional Info */}
                            {order.notes && (
                                <Box sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: 1,
                                }}>
                                    <Typography sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
                                        Notes
                                    </Typography>
                                    <Typography sx={{ color: 'white', ml: 2 }}>{order.notes}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            {/* Divider Row */}
            <TableRow>
                <TableCell colSpan={6} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', py: 0.5 }} />
            </TableRow>
        </React.Fragment>
    );
}

export default function ManageMyOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState('all'); // Default to show all orders
    const [page, setPage] = useState(1);
    const itemsPerPage = 5; // Fixed page size
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getMyOrders();
                setOrders(response.result);
                setFilteredOrders(response.result); // Initially show all orders
            } catch (err) {
                setError(err.message || 'Failed to fetch orders');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        // Filter orders based on tabValue
        let newFilteredOrders;
        if (tabValue === 'all') {
            newFilteredOrders = orders;
        } else {
            const status = parseInt(tabValue);
            newFilteredOrders = orders.filter(order => order.status === status);
        }
        setFilteredOrders(newFilteredOrders);
        setPage(1); // Reset to first page when tab changes
    }, [tabValue, orders]);

    useEffect(() => {
        // Update displayed orders based on pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
        setTotalPages(Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage)));
    }, [filteredOrders, page]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

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
            }} />
            <Box sx={{ padding: 4, marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
                <GlassCard style={{ width: '90%', padding: '30px' }}>
                    <Typography variant="h4" sx={{ fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', mb: 3 }}>
                        My Orders 🗒️
                    </Typography>

                    {/* Tabs for status filtering */}
                    <Box sx={{
                        width: '100%',
                        mb: 2,
                        borderBottom: 1,
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#FFD700'
                                },
                            }}
                        >
                            <Tab
                                label="All"
                                value="all"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif"
                                }}
                            />
                            <Tab
                                label="Pending"
                                value="0"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif"
                                }}
                            />
                            <Tab
                                label="Processing"
                                value="1"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif"
                                }}
                            />
                            <Tab
                                label="Shipped"
                                value="2"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif"
                                }}
                            />
                            <Tab
                                label="Delivered"
                                value="3"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif"
                                }}
                            />
                            <Tab
                                label="Cancelled"
                                value="4"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif"
                                }}
                            />
                        </Tabs>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress sx={{ color: '#FFD700' }} />
                        </Box>
                    ) : error ? (
                        <Typography sx={{ color: 'white', textAlign: 'center' }}>{error}</Typography>
                    ) : filteredOrders.length === 0 ? (
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', my: 4 }}>
                            {orders.length === 0 ? "No orders found" : "No orders found for this status"}
                        </Typography>
                    ) : (
                        <>
                            <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="60px" /> {/* Expand/collapse control */}
                                            <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order Items</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayedOrders.map((order) => (
                                            <OrderRow key={order._id} order={order} />
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
            </Box>
        </>
    );
}