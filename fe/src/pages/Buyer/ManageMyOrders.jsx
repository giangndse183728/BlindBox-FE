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

    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return '#ff9800'; // Pending - orange
            case 1:
                return '#2196f3'; // Processing - blue
            case 2:
                return '#9c27b0'; // Shipped - purple
            case 3:
                return '#4caf50'; // Delivered - green
            case 4:
                return '#f44336'; // Cancelled - red
            default:
                return '#9e9e9e'; // Unknown - grey
        }
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
            <Box sx={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderRadius: 2,
                boxShadow: 3
            }}>
                <Typography variant="h4" gutterBottom sx={{
                    color: 'primary.main',
                    fontWeight: 'bold',
                    mb: 3
                }}>
                    My Orders
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : orders.length === 0 ? (
                    <Typography>No orders found</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: 1,
                        boxShadow: 1,
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow>
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
                                    <TableRow
                                        key={order._id}
                                        hover
                                        sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
                                    >
                                        <TableCell sx={{ color: 'white', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{order._id}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>${order.totalPrice}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Box sx={{
                                                backgroundColor: getStatusColor(order.status),
                                                color: 'white',
                                                borderRadius: 1,
                                                p: 0.5,
                                                display: 'inline-block',
                                                textAlign: 'center',
                                                minWidth: 90,
                                                border: `1px solid ${getStatusColor(order.status)}`,
                                                fontWeight: 'bold',
                                            }}>
                                                {getStatusText(order.status)}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>{order.receiverInfo.fullName}</TableCell>
                                        <TableCell sx={{ color: 'white', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.receiverInfo.address}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{order.receiverInfo.phoneNumber}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{formatDate(order.createdAt)}</TableCell>
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
