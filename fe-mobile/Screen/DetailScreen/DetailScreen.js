import React, { useState } from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { Appbar, Card, Paragraph } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import heart icon
import { useNavigation, useRoute } from "@react-navigation/native";

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  const products = [
    { id: 1, name: "Anime Blind Box", img: require('../CollectionScreen/blindbox1.png'), price: 2999.99, brand: "Pop Mart", description: "A surprise anime-themed blind box with exclusive figurines.", rating: 4.5 },
    { id: 2, name: "Superhero Surprise Pack", img: require('../CollectionScreen/blindbox1.png'), price: 2500, brand: "My Kingdom", description: "Unleash the hero inside you with this mystery superhero box.", rating: 4 },
    { id: 3, name: "Kawaii Collectibles", img: require('../CollectionScreen/blindbox1.png'), price: 3200, brand: "Tokidoki", description: "A collection of adorable kawaii items to brighten your day.", rating: 3 },
  ];

  const product = products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log(`${quantity} of ${product.name} added to cart`);
  };

  return (
    <ImageBackground 
      source={require('./background.jpeg')} 
      style={styles.container}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={product ? product.name : "Product Not Found"} />
      </Appbar.Header>

      {product ? (
        <Card style={styles.card}>
          <Card.Cover source={product.img} style={styles.productImage} />
          <Card.Content>
            <Text style={styles.productName}>{product.name}</Text>
            <Paragraph style={styles.productBrand}>Brand: {product.brand}</Paragraph>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <Paragraph style={styles.productDescription}>{product.description}</Paragraph>
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
            <Button title="Add to Cart" onPress={handleAddToCart} color="#f8b400" />
          </Card.Content>
        </Card>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Product not found.</Text>
          <Text style={styles.notFoundDescription}>We couldn't find the product you're looking for. Please check the ID or return to the collection page.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} color="#f8b400" />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 10,
    backgroundColor: "transparent", 
  },
  productImage: {
    height: 400,
    backgroundColor: "transparent",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "white", 
  },
  productBrand: {
    color: "white", 
  },
  productDescription:{
    color: "white",
  },
  productPrice: {
    color: "white", 
    fontSize: 16,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  heartRating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  ratingLabel: {
    fontSize: 16,
    marginRight: 5,
    color: "white", 
  },
  ratingValue: {
    fontSize: 16,
    marginLeft: 5,
    color: "white", 
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    marginVertical: 10,
  },
  quantityText: {
    fontSize: 16,
    marginRight: 10,
    color: "white", 
  },
  quantityButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityValue: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "white", 
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    color: "white",
    fontSize: 24,
    marginBottom: 10,
  },
  notFoundDescription: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  heartIcon: {
    marginRight: 5, 
  },
});

export default DetailScreen;