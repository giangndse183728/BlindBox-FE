import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal  } from "react-native";
import { Appbar, Card, Title, Paragraph, Provider as PaperProvider } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { useNavigation } from "@react-navigation/native";
import Filter from "./Filter";

const CollectionPage = () => {
  const navigation = useNavigation();
  const [products] = useState([
    { id: 1, name: "Anime Blind Box", img: require('../Collectionpage/blindbox1.png'), price: 2999.99, brand: "Pop Mart", type: "Unbox", rating: 4.5 },
    { id: 2, name: "Superhero Surprise Pack", img: require('../Collectionpage/blindbox1.png'), price: 2500, brand: "My Kingdom", type: "Seal", rating: 4 },
    { id: 3, name: "Kawaii Collectibles", img: require('../Collectionpage/blindbox1.png'), price: 3200, brand: "Tokidoki", type: "Unbox", rating: 3 },
    { id: 4, name: "Gaming Loot Crate", img: require('../Collectionpage/blindbox1.png'), price: 1999.99, brand: "Funko", type: "Seal", rating: 5 },
    { id: 5, name: "Sci-Fi Mystery Box", img: require('../Collectionpage/blindbox1.png'), price: 4500, brand: "Mighty Jaxx", type: "Unbox", rating: 2 },
    { id: 6, name: "Cartoon Nostalgia Box", img: require('../Collectionpage/blindbox1.png'), price: 2800, brand: "Kidrobot", type: "Unbox", rating: 3 },
    { id: 7, name: "Fantasy Adventure Pack", img: require('../Collectionpage/blindbox1.png'), price: 3500, brand: "Pop Mart", type: "Seal", rating: 3.5 },
    { id: 8, name: "Retro Game Blind Box", img: require('../Collectionpage/blindbox1.png'), price: 4000, brand: "My Kingdom", type: "Unbox", rating: 1 },
    { id: 9, name: "Limited Edition Blind Box", img: require('../Collectionpage/blindbox1.png'), price: 4999.99, brand: "Tokidoki", type: "Seal", rating: 1.5 },
    { id: 10, name: "Horror Themed Surprise", img: require('../Collectionpage/blindbox1.png'), price: 2700, brand: "Funko", type: "Unbox", rating: 2.5 },
    { id: 11, name: "Marvel Blind Box", img: require('../Collectionpage/blindbox1.png'), price: 3300, brand: "Mighty Jaxx", type: "Seal", rating: 4 },
    { id: 12, name: "DC Comics Mystery Pack", img: require('../Collectionpage/blindbox1.png'), price: 3100, brand: "Kidrobot", type: "Unbox", rating: 3.5 },
    { id: 13, name: "Anime Limited Edition Box", img: require('../Collectionpage/blindbox1.png'), price: 3799.99, brand: "Pop Mart", type: "Seal", rating: 2 },
  ]);

  const truncateName = (name, wordLimit) => {
    const words = name.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (filters) => {
    const { priceRange, selectedBrand, selectedType, selectedRating } = filters;

    let filtered = products.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedBrand.length === 0 || selectedBrand.includes(product.brand)) &&
        (selectedType.length === 0 || selectedType.includes(product.type)) &&
        product.rating >= selectedRating
    );
    setFilteredProducts(filtered);
    setShowFilters(false); // Close the modal after applying
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}>
      <Card style={styles.productCard}>
        <Card.Cover source={item.img} style={styles.productImage} />
        <Card.Content>
        <Title style={styles.productName}>{truncateName(item.name, 1)}</Title>
          <Paragraph>{item.brand}</Paragraph>
          <Text>${item.price.toFixed(2)}</Text>
          <Rating ratingCount={5} imageSize={20} readonly startingValue={item.rating} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.header}>BlindB!ox</Text>
        <Appbar.Action icon="filter" onPress={() => setShowFilters(true)} />

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />

        <Modal visible={showFilters} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <Filter onApplyFilters={applyFilters} onClose={() => setShowFilters(false)} />
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  header: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  productCard: {
    margin: 5,
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  productImage: {
    height: 150,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    color: "black",
    marginBottom: 5,
  },
  productList: {
    paddingBottom: 50,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
});

export default CollectionPage;