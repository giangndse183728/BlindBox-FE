import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ImageBackground, ActivityIndicator } from "react-native";
import { Appbar, Card, Title, Provider as PaperProvider } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import Filter from "./Filter";
import { fetchBlindboxData } from "../../service/productApi"; // Import API fetch

const CollectionScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchBlindboxData();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const truncateName = (name, wordLimit) => {
    const words = name.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };

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
    setShowFilters(false);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Detail", { productId: item.id, slug: item.slug })}>
      <Card style={styles.productCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.productImage} />
        <Card.Content>
          <Title style={styles.productName}>{truncateName(item.name, 1)}</Title>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productPrice}>
            ${Number(item.price).toFixed(2)}
          </Text>

          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, index) => (
              <Icon
                key={index}
                name="heart"
                size={20}
                color={index < Math.round(item.rating) ? "red" : "white"}
                style={styles.heartIcon}
              />
            ))}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <ImageBackground source={require('./background.jpeg')} style={styles.container}>
        <Text style={styles.header}>BlindB!ox</Text>
        <Appbar.Action icon="filter" onPress={() => setShowFilters(true)} />

        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        )}

        <Modal visible={showFilters} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <Filter onApplyFilters={applyFilters} onClose={() => setShowFilters(false)} />
          </View>
        </Modal>
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "transparent",
  },
  productImage: {
    height: 150,
    backgroundColor: "transparent",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
    color: "white",
  },
  productBrand: {
    color: "white",
  },
  productPrice: {
    color: "white",
  },
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: "transparent",
  },
  heartIcon: {
    backgroundColor: "transparent",
    marginRight: 5,
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

export default CollectionScreen;
