import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ImageBackground, ActivityIndicator } from "react-native";
import { Appbar, Card } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchBlindboxDetails } from "../../service/productApi"; 

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, slug } = route.params; // Nhận slug và id từ navigation params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f8b400" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('./background.jpeg')} style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={product ? product.name : "Product Not Found"} />
      </Appbar.Header>

      {product ? (
        <Card style={styles.card}>
          <Card.Cover source={{ uri: product.img }} style={styles.productImage} />
          <Card.Content>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBrand}>Brand: {product.brand}</Text>
            <Text style={styles.productPrice}>${Number(product.price).toFixed(2)}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.heartRating}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Icon
                    key={index}
                    name="heart"
                    size={20}
                    color={index < Math.round(product.rating) ? "red" : "white"}
                    style={styles.heartIcon}
                  />
                ))}
              </View>
              <Text style={styles.ratingValue}>{product.rating}</Text>
            </View>

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
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Product not found.</Text>
          <Text style={styles.notFoundDescription}>
            We couldn't find the product you're looking for. Please check the ID or return to the collection page.
          </Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { margin: 10, backgroundColor: "transparent" },
  productImage: { height: 400, backgroundColor: "transparent" },
  productName: { fontWeight: "bold", fontSize: 18, marginBottom: 5, color: "white" },
  productBrand: { color: "white" },
  productDescription: { color: "white" },
  productPrice: { color: "white", fontSize: 16, marginBottom: 10 },
  ratingContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 },
  heartRating: { flexDirection: "row", alignItems: "center", marginRight: 5 },
  ratingLabel: { fontSize: 16, marginRight: 5, color: "white" },
  ratingValue: { fontSize: 16, marginLeft: 5, color: "white" },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 },
  quantityText: { fontSize: 16, marginRight: 10, color: "white" },
  quantityButtons: { flexDirection: "row", alignItems: "center" },
  quantityValue: { marginHorizontal: 10, fontSize: 16, color: "white" },
  notFoundContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFoundText: { color: "white", fontSize: 24, marginBottom: 10 },
  notFoundDescription: { color: "white", textAlign: "center", marginBottom: 20 },
  heartIcon: { marginRight: 5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 18, marginBottom: 10 },
});

export default DetailScreen;
