import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Collapse, IconButton, Chip
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { getMyOrders } from '../../services/ordersApi';
import GlassCard from '../../components/Decor/GlassCard'; // Assuming this is available
import OrderStatusStepper from '../../components/Order/OrderStatusStepper'; // Assuming this is available

// Define order status constants similar to ManageSellerOrders
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
                <TableCell sx={{ color: 'white', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.receiverInfo.address}</TableCell>
                <TableCell sx={{ color: 'white' }}>{order.receiverInfo.phoneNumber}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatDate(order.createdAt)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" sx={{ fontFamily: "'Jersey 15', sans-serif", color: '#FFD700', mb: 2 }}>
                                Order Details
                            </Typography>

                            {/* Order Status Stepper */}
                            <OrderStatusStepper status={order.status} />

                            {/* Ordered Items */}
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
                                                        <Typography sx={{ color: 'white' }}>{item.productName}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', textAlign: 'center' }}>
                                                    ${parseFloat(item.price).toFixed(2)}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', textAlign: 'center' }}>{item.quantity}</TableCell>
                                                <TableCell sx={{ color: 'white', textAlign: 'right' }}>
                                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={3} sx={{ color: '#FFD700', textAlign: 'right', fontWeight: 'bold' }}>
                                                Total
                                            </TableCell>
                                            <TableCell sx={{ color: '#FFD700', textAlign: 'right', fontWeight: 'bold' }}>
                                                ${parseFloat(order.totalPrice).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
        </React.Fragment>
    );
}

export default function ManageMyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getMyOrders();
                setOrders(response.result);
            } catch (err) {
                setError(err.message || 'Failed to fetch orders');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
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
            }} />
            <Box sx={{ padding: 4, marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
                <GlassCard style={{ width: '90%', padding: '30px' }}>
                    <Typography variant="h4" sx={{ fontFamily: "'Jersey 15', sans-serif", color: 'whitesmoke', mb: 3 }}>
                        My Orders 🗒️
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress sx={{ color: '#FFD700' }} />
                        </Box>
                    ) : error ? (
                        <Typography sx={{ color: 'white', textAlign: 'center' }}>{error}</Typography>
                    ) : orders.length === 0 ? (
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', my: 4 }}>
                            No orders found
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="60px" /> {/* Expand/collapse control */}
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order ID</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Total Price</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif", textAlign: 'center' }}>Status</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Receiver</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Address</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Phone</TableCell>
                                        <TableCell sx={{ color: 'white', fontFamily: "'Jersey 15', sans-serif" }}>Order Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <OrderRow key={order._id} order={order} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </GlassCard>
            </Box>
        </>
    );
}