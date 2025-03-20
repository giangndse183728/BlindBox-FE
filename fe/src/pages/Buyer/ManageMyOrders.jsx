import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Collapse, IconButton, Chip,
    Tabs, Tab, Pagination, Divider, TextField, InputAdornment
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import SearchIcon from '@mui/icons-material/Search';
import { getMyOrders } from '../../services/ordersApi';
import GlassCard from '../../components/Decor/GlassCard';
import OrderStatusStepper from '../../components/Order/OrderStatusStepper';

const ORDER_STATUS = {
    0: { label: 'Pending', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.2)', icon: <PendingIcon /> },
    1: { label: 'Confirmed', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)', icon: <ReceiptIcon /> },
    2: { label: 'Processing', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)', icon: <LocalShippingIcon /> },
    3: { label: 'Completed', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)', icon: <CheckCircleIcon /> },
    4: { label: 'Cancelled', color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.2)', icon: <CancelIcon /> }
};

// expandable row
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
                <TableCell colSpan={6}>
                    <Box sx={{ mb: 2 }}>
                        {/* Order ID and Status Chip */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                                Order ID: {order._id}
                            </Typography>
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
                        </Box>
                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                        {order.items.map((item) => (
                            <Box
                                key={item._id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: 1,
                                    p: 3,
                                    mb: 2,
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.productName}
                                    sx={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 1, mr: 3 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>
                                        {item.productName}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
                                        x{item.quantity}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}
                        {/* Summary Section */}
                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                            {order.discount && (
                                <Typography sx={{ color: '#F44336', fontSize: '1.1rem', mb: 1 }}>
                                    Combo Discount: -${parseFloat(order.discount).toFixed(2)}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem', mr: 2 }}>
                                    Total: ${parseFloat(order.totalPrice).toFixed(2)}
                                </Typography>
                                <IconButton
                                    aria-label="expand row"
                                    size="medium"
                                    onClick={() => setOpen(!open)}
                                    sx={{ color: 'white' }}
                                >
                                    {open ? <KeyboardArrowUpIcon fontSize="large" /> : <KeyboardArrowDownIcon fontSize="large" />}
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
                            {/* Order Details (Total Price, Receiver, Order Date) */}
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="60px" /> {/* Empty cell to align with header */}
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Total Price</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Receiver</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <TableCell width="60px" /> {/* Empty cell to align with header */}
                                        <TableCell sx={{ color: 'white' }}>${parseFloat(order.totalPrice).toFixed(2)}</TableCell>
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
    const [tabValue, setTabValue] = useState('all');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getMyOrders();
                setOrders(response.result);
                setFilteredOrders(response.result);
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
        // Filter orders based on tabValue and search query
        let newFilteredOrders;
        if (tabValue === 'all') {
            newFilteredOrders = orders;
        } else {
            const status = parseInt(tabValue);
            newFilteredOrders = orders.filter(order => order.status === status);
        }

        // Apply search filter if a search query exists
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            newFilteredOrders = newFilteredOrders.filter(order =>
                order._id.toLowerCase().includes(query) ||
                order.items.some(item =>
                    item.productName.toLowerCase().includes(query)
                )
            );
        }

        setFilteredOrders(newFilteredOrders);
        setPage(1);
    }, [tabValue, orders, searchQuery]);

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
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

                    {/* Search Bar */}
                    <Box sx={{ mb: 3 }}>
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
                    </Box>

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
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.3rem'
                                }}
                            />
                            <Tab
                                label="Pending"
                                value="0"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.3rem'
                                }}
                            />
                            <Tab
                                label="Confirmed"
                                value="1"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.3rem'
                                }}
                            />
                            <Tab
                                label="Processing"
                                value="2"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.3rem'
                                }}
                            />
                            <Tab
                                label="Completed"
                                value="3"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.3rem'
                                }}
                            />
                            <Tab
                                label="Cancelled"
                                value="4"
                                sx={{
                                    color: 'white',
                                    '&.Mui-selected': { color: '#FFD700' },
                                    fontFamily: "'Jersey 15', sans-serif",
                                    fontSize: '1.3rem'
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
                                            <TableCell
                                                sx={{
                                                    color: '#FFD700',
                                                    fontFamily: "'Jersey 15', sans-serif",
                                                    fontSize: '1.5rem',

                                                }}
                                            >
                                                Order Items
                                            </TableCell>
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