import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderData, paymentMethod } = route.params || {};

  if (!orderData) {
    return (
      <ImageBackground 
        source={require('../../assets/background.jpeg')}
        style={styles.container}
      >
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Order information not found</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Return to Shop</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      0: 'Pending',
      1: 'Processing',
      2: 'Shipped',
      3: 'Delivered',
      4: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: '#FF9800', // Pending - Orange
      1: '#2196F3', // Processing - Blue
      2: '#9C27B0', // Shipped - Purple
      3: '#4CAF50', // Delivered - Green
      4: '#F44336', // Cancelled - Red
    };
    return colorMap[status] || '#757575';
  };

  const getPaymentMethodIcon = () => {
    return paymentMethod === 0 ? 'local-shipping' : 'account-balance';
  };

  const getPaymentMethodName = () => {
    return paymentMethod === 0 ? 'Cash on Delivery' : 'QR (Bank Transfer)';
  };

  // QR Code URL for bank transfer
  console.log('Order Data:', process.env.EXPO_PUBLIC_ACCOUNT, process.env.EXPO_PUBLIC_BANK_NAME);
  const qrUrl = paymentMethod === 1 
    ? `https://qr.sepay.vn/img?acc=${process.env.EXPO_PUBLIC_ACCOUNT}&bank=${process.env.EXPO_PUBLIC_BANK_NAME}&amount=${Math.round(orderData.totalPrice * 1000)}&des=${encodeURIComponent(`orderId ${orderData._id}`)}&lock=true`
    : null;

  return (
    <ImageBackground 
      source={require('../../assets/background.jpeg')}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Success Header */}
          <View style={styles.header}>
            <Icon name="check-circle-outline" size={80} color="#4CAF50" />
            <Text style={styles.title}>Order Placed Successfully!</Text>
            <Text style={styles.subtitle}>
              Thank you for your purchase. Your order has been received.
            </Text>
          </View>

          {/* Payment Information */}
          {paymentMethod === 1 ? (
            <View style={styles.qrSection}>
              <Text style={styles.sectionTitle}>Scan QR Code to Pay</Text>
              <Image
                source={{ uri: qrUrl }}
                style={styles.qrCode}
                resizeMode="contain"
              />
              <Text style={styles.paymentInstruction}>
                Please scan the QR code above to complete your payment via Bank Transfer.
              </Text>
            </View>
          ) : (
            <View style={styles.qrSection}>
              <Text style={styles.sectionTitle}>Payment Information</Text>
              <Text style={styles.paymentInstruction}>
                You have chosen Cash on Delivery. Please prepare ${orderData.totalPrice.toFixed(2)} to pay upon delivery.
              </Text>
            </View>
          )}

          {/* Order Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID:</Text>
              <Text style={styles.detailValue}>{orderData._id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(orderData.createdAt)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderData.status) }]}>
                <Text style={styles.statusText}>{getOrderStatusText(orderData.status)}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <View style={styles.paymentMethod}>
                <Icon name={getPaymentMethodIcon()} size={20} color="white" />
                <Text style={styles.paymentText}>{getPaymentMethodName()}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>${orderData.totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* Shipping Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <Text style={styles.shippingName}>{orderData.receiverInfo.fullName}</Text>
            <Text style={styles.shippingDetail}>{orderData.receiverInfo.phoneNumber}</Text>
            <Text style={styles.shippingDetail}>{orderData.receiverInfo.address}</Text>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {orderData.items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/80' }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${orderData.totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.navigate('CartMain')}
            >
              <Text style={styles.buttonText}>Back to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.continueButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.ordersButton]}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.buttonText}>View My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  paymentInstruction: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    color: 'white',
    marginLeft: 5,
  },
  totalAmount: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shippingName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  shippingDetail: {
    color: 'white',
    marginBottom: 5,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  itemPrice: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    minWidth: '30%',
  },
  backButton: {
    backgroundColor: '#666',
  },
  continueButton: {
    backgroundColor: '#333',
  },
  ordersButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OrderSuccess;