import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useCartStore from "./CartStore";
import OrderInfoDialog from "./OrderInfoDialog";
import { fetchUserData } from "../../service/userApi";

const truncateString = (str, maxLength = 15) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

const CartScreen = () => {
  const navigation = useNavigation();
  const { cart, fetchCartItems, isLoading, removeFromCart, clearCart, updateQuantity } =
    useCartStore();

  const [orderInfo, setOrderInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
  });

  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await fetchUserData();
        setOrderInfo({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load user information');
      }
    };

    getUserProfile();
  }, []);

  const handleRemove = (productId) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel" },
      { 
        text: "OK", 
        onPress: async () => {
          try {
            await removeFromCart(productId);
            Alert.alert("Success", "Item removed from cart.");
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        } 
      },
    ]);
  };

  const handleUpdateQuantity = async (itemId, newQuantity, maxQuantity) => {
    if (newQuantity < 1) {
      Alert.alert("Invalid Quantity", "Quantity must be at least 1.");
      return;
    }
    if (newQuantity > maxQuantity) {
      Alert.alert("Maximum Quantity", `You can't add more than ${maxQuantity} items (Available stock).`);
      return;
    }
    try {
      await updateQuantity(itemId, newQuantity);
      await fetchCartItems();
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    }
  };

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear the cart?", [
      { text: "Cancel" },
      { text: "OK", onPress: async () => {
        await clearCart();
        Alert.alert("Success", "Cart cleared.");
      }},
    ]);
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      await clearCart();
      setOpenOrderDialog(false);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(
        "Error",
        "Failed to complete checkout. Please try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f8b400" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cart === null || cart.items.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty!</Text>
      ) : (
        <>
          <View style={styles.cartContainer}>
            <FlatList
              data={cart.items}
              keyExtractor={(item) => item.product._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Text style={styles.productName}>
                    {truncateString(item.product?.name || "Unnamed Product")}
                  </Text>
                  <View style={styles.quantityButtons}>
                    <TouchableOpacity 
                      onPress={() => handleUpdateQuantity(item.product._id, item.cartQuantity - 1, item.product.quantity)}
                      style={styles.quantityButtonContainer}
                    >
                      <Text style={styles.quantityButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {item.cartQuantity}
                      {item.cartQuantity >= item.product.quantity && ' (Max)'}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => handleUpdateQuantity(item.product._id, item.cartQuantity + 1, item.product.quantity)}
                      style={[
                        styles.quantityButtonContainer,
                        item.cartQuantity >= item.product.quantity && styles.disabledButton
                      ]}
                      disabled={item.cartQuantity >= item.product.quantity}
                    >
                      <Text style={[
                        styles.quantityButton,
                        item.cartQuantity >= item.product.quantity && styles.disabledButtonText
                      ]}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    onPress={() => handleRemove(item.product._id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Total Items: {cart.totalItems} | Total Price: ${cart.items.reduce(
                (sum, item) => sum + item.totalPrice,
                0
              )}
            </Text>

            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => setOpenOrderDialog(true)}
            >
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <OrderInfoDialog
        visible={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        orderInfo={orderInfo}
        cart={cart}
        onSubmit={handleCheckout}
        isLoading={checkoutLoading}
        error={checkoutError}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "white"
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  productName: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  priceText: {
    color: 'white',
    fontSize: 14,
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 5,
  },
  quantityButtonContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    width: 20,
    textAlign: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  removeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    borderRadius: 4,
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)',
    paddingBottom: 25
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: 'white',
    textAlign: 'center'
  },
  clearButton: {
    padding: 8,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'center',
    width: 80
  },
  clearButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 12
  },
  checkoutButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f8b400",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  cartContainer: {
    flex: 1,
    marginBottom: 120
  },
});

export default CartScreen;