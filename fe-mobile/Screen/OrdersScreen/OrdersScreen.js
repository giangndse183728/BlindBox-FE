import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getMyOrders, completeOrderStatus, cancelOrder } from '../../service/ordersApi';

const OrdersScreen = ({ navigation, onLogout }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getMyOrders();
            console.log('API Response:', response);

            if (response && response.result && Array.isArray(response.result)) {
                setOrders(response.result);
            } else {
                throw new Error('No orders found');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchOrders(); // Fetch orders when the screen is focused
        });

        return unsubscribe;
    }, [navigation]);

    const handleLogout = () => {
        setOrders([]); // Clear orders on logout
        Alert.alert("Logged out successfully");
        onLogout(); // Call the logout function passed from ProfileScreen
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            await completeOrderStatus(orderId);
            Alert.alert('Success', 'Order completed successfully');
            fetchOrders();
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to complete order');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            Alert.alert('Success', 'Order cancelled successfully');
            fetchOrders();
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to cancel order');
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order ID: {item._id}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            <Text style={styles.orderText}>Total Price: ${item.totalPrice.toFixed(2)}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleCompleteOrder(item._id)} style={styles.button}>
                    <Text style={styles.buttonText}>Complete Order</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancelOrder(item._id)} style={styles.button}>
                    <Text style={styles.buttonText}>Cancel Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View>
            <TouchableOpacity onPress={handleLogout}>
                <Text>Logout</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    orderItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 4,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingIndicator: {
        marginTop: 20,
    },
});

export default OrdersScreen; 