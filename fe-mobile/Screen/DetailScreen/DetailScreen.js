import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, Button, ImageBackground, 
  ActivityIndicator, Alert 
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { fetchBlindboxDetails } from "../../service/productApi"; 

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, slug } = route.params; 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Kiểm tra đăng nhập trước khi load sản phẩm
  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          Alert.alert("Session Expired", "Please login again.");
          navigation.replace("Login");
        }
      };

      checkAuth();
    }, [])
  );

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchBlindboxDetails(slug, productId);
        console.log("Fetched product data:", data); // Debugging log
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, slug]);

  // Nếu đang loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f8b400" />
      </View>
    );
  }

  // Nếu có lỗi khi fetch dữ liệu
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
      </View>
    );
  }

  // Nếu sản phẩm không tồn tại
  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
      </View>
    );
  }

  return (
    <ImageBackground source={require("../../assets/background.jpeg")} style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={product.name} />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Cover source={{ uri: product.image }} style={styles.productImage} />
        <Card.Content>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>Brand: {product.brand}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Chọn số lượng */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Quantity:</Text>
            <View style={styles.quantityButtons}>
              <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Button title="+" onPress={() => setQuantity(quantity + 1)} />
            </View>
          </View>

          <Button title="Add to Cart" color="#f8b400" />
        </Card.Content>
      </Card>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { margin: 10, backgroundColor: "transparent" },
  productImage: { height: 400, backgroundColor: "transparent" },
  productName: { fontWeight: "bold", fontSize: 18, marginBottom: 5, color: "white" },
  productBrand: { color: "white" },
  productDescription: { color: "white" },
  productPrice: { color: "white", fontSize: 16, marginBottom: 10 },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 },
  quantityText: { fontSize: 16, marginRight: 10, color: "white" },
  quantityButtons: { flexDirection: "row", alignItems: "center" },
  quantityValue: { marginHorizontal: 10, fontSize: 16, color: "white" },
  notFoundContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFoundText: { color: "white", fontSize: 24, marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 18, marginBottom: 10 },
});

export default DetailScreen;
