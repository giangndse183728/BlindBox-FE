import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { getMyOrders } from '../../services/ordersApi';

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

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return 'Pending';
            case 1:
                return 'Processing';
            case 2:
                return 'Shipped';
            case 3:
                return 'Delivered';
            case 4:
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            <Box sx={{}}>
                <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
                    My Orders
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" sx={{ color: 'white' }}>{error}</Typography>
                ) : orders.length === 0 ? (
                    <Typography sx={{ color: 'white' }}>No orders found</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Total Price</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Receiver</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Order Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>${order.totalPrice}</TableCell>
                                        <TableCell>{getStatusText(order.status)}</TableCell>
                                        <TableCell>{order.receiverInfo.fullName}</TableCell>
                                        <TableCell>{order.receiverInfo.address}</TableCell>
                                        <TableCell>{order.receiverInfo.phoneNumber}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </>
    );
}
