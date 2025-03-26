import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ImageBackground, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { fetchBlindboxDetails } from "../../service/productApi"; 
import useCartStore from '../CartScreen/CartStore';

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, slug } = route.params; 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  // Check authentication before loading the product
  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          Alert.alert("You need to login to see detail", "Please login again.");
          navigation.replace("Login");
        }
      };

      checkAuth();
    }, [])
  );

  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchBlindboxDetails(slug, productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, slug]);

  // Add this function to handle quantity changes
  const handleQuantityChange = (increment) => {
    const newQuantity = quantity + increment;
    if (newQuantity < 1) {
      Alert.alert("Invalid Quantity", "Quantity must be at least 1.");
      return;
    }
    if (product && newQuantity > product.quantity) {
      Alert.alert("Maximum Quantity", `You can't add more than ${product.quantity} items (Available stock).`);
      return;
    }
    setQuantity(newQuantity);
  };

  // If loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f8b400" />
      </View>
    );
  }

  // If there's an error fetching data
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
      </View>
    );
  }

  // If product doesn't exist
  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
      </View>
    );
  }

  // Handle adding to cart
  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity); 
      Alert.alert("Success", "Product added to cart!");
    } catch (error) {
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };

  return (
    <ImageBackground source={require("../../assets/background.jpeg")} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: product.image }} style={styles.productImage} />
          <Card.Content>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBrand}>Brand: {product.brand}</Text>
            <Text style={styles.productPrice}>${Number(product.price).toFixed(2)}</Text>
            <Text style={styles.stockInfo}>Available Stock: {product.quantity}</Text>

            {/* Quantity selection */}
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>Quantity:</Text>
              <View style={styles.quantityButtons}>
                <TouchableOpacity 
                  onPress={() => handleQuantityChange(-1)}
                  style={styles.quantityButtonContainer}
                >
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => handleQuantityChange(1)}
                  style={[
                    styles.quantityButtonContainer,
                    quantity >= product.quantity && styles.disabledButton
                  ]}
                  disabled={quantity >= product.quantity}
                >
                  <Text style={[
                    styles.quantityButton,
                    quantity >= product.quantity && styles.disabledButtonText
                  ]}>+</Text>
                </TouchableOpacity>
              </View>
              {quantity >= product.quantity && (
                <Text style={styles.maxQuantityText}>(Maximum stock reached)</Text>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.addToCartButton,
                quantity > product.quantity && styles.disabledButton
              ]}
              onPress={handleAddToCart}
              disabled={quantity > product.quantity}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "transparent"
  },
  scrollView: {
    flex: 1,
  },
  card: { 
    margin: 10, 
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    overflow: "hidden"
  },
  productImage: {
    marginTop:20, 
    height: 300, // Reduced height
    backgroundColor: "transparent",
    borderRadius: 15
  },
  productName: { 
    fontSize: 24,
    marginBottom: 10,
    color: "white",
    fontFamily: 'Jersey 15',
    textAlign: "center"
  },
  productBrand: { 
    color: "white",
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Jersey 15',
    textAlign: "center"
  },
  productPrice: { 
    color: "yellow",
    fontSize: 24,
    marginBottom: 15,
    fontFamily: 'Jersey 15',
    textAlign: "center",
    fontWeight: "bold"
  },
  quantityContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  quantityText: { 
    fontSize: 18,
    marginBottom: 10,
    color: "white",
    fontFamily: 'Jersey 15'
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 5,
    marginTop: 5,
  },
  quantityButtonContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    width: 24,
    textAlign: 'center',
    fontFamily: 'Jersey 15'
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: 'white',
    fontFamily: 'Jersey 15'
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.5,
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  maxQuantityText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'Jersey 15'
  },
  stockInfo: {
    color: 'yellow',
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'Jersey 15',
    textAlign: "center"
  },
  addToCartButton: {
    backgroundColor: 'yellow',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'white'
  },
  addToCartButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Jersey 15'
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  descriptionTitle: {
    color: 'yellow',
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Jersey 15',
    textAlign: 'center'
  },
  productDescription: { 
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Jersey 15',
    textAlign: "center"
  },
  notFoundContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "transparent"
  },
  notFoundText: { 
    color: "white", 
    fontSize: 24, 
    marginBottom: 10,
    fontFamily: 'Jersey 15'
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "transparent"
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "transparent"
  },
  errorText: { 
    color: "#ff6b6b", 
    fontSize: 18, 
    marginBottom: 10,
    fontFamily: 'Jersey 15'
  },
});

export default DetailScreen;