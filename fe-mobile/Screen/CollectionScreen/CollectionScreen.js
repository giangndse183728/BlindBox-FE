import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ImageBackground, ActivityIndicator, Image } from "react-native";
import { Appbar, Card, Title, Provider as PaperProvider, Menu, Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import Filter from "./Filter";
import { fetchBlindboxData } from "../../service/productApi";

const CollectionScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brands, setBrands] = useState([]);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchBlindboxData();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique brands from products
        const uniqueBrands = [...new Set(data.map(product => product.brand))];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    const unsubscribe = navigation.addListener("focus", checkLoginStatus);
    return unsubscribe;
  }, [navigation]);

  const truncateName = (name, wordLimit) => {
    const words = name.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : name;
  };

  const applyFilters = (filters) => {
    const { priceRange, selectedBrand, selectedRating } = filters;
    let filtered = [...products]; // Create a copy of products array

    // Apply price filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply brand filter
    if (selectedBrand.length > 0) {
      filtered = filtered.filter((product) => selectedBrand.includes(product.brand));
    }

    // Apply rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter((product) => product.rating >= selectedRating);
    }

    setFilteredProducts(filtered);
    setShowFilters(false);
  };

  const sortProducts = (order) => {
    let sortedProducts = [...filteredProducts];
    if (order === "az") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === "za") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (order === "low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (order === "high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sortedProducts);
    setSortMenuVisible(false);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Detail", { productId: item._id, slug: item.slug })}>
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
      <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
        {/* Header + Nút Login hoặc Icon User */}
        <View style={styles.headerContainer}>
          <Text style={[styles.header, styles.yellowGlow]}>BlindB!ox</Text>

          {isLoggedIn ? (
            <TouchableOpacity 
              onPress={() => navigation.navigate("Profile")}
              style={styles.profileButton}
            >
              <Image 
                source={require('../../assets/pfp.jpeg')} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => navigation.navigate("Login", { setIsLoggedIn })} 
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter and Sort Row */}
        <View style={styles.filterSortRow}>
          <TouchableOpacity 
            onPress={() => setShowFilters(true)}
            style={styles.filterButton}
          >
            <Icon name="filter" size={20} color="white" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                onPress={() => setSortMenuVisible(true)}
                style={styles.sortButton}
              >
                <Icon name="sort" size={20} color="white" />
                <Text style={styles.sortButtonText}>Sort</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => sortProducts("az")} title="A-Z" />
            <Menu.Item onPress={() => sortProducts("za")} title="Z-A" />
            <Menu.Item onPress={() => sortProducts("low-high")} title="Lowest to Highest" />
            <Menu.Item onPress={() => sortProducts("high-low")} title="Highest to Lowest" />
          </Menu>
        </View>

        {/* Product List */}
        {loading ? (
          <ActivityIndicator size="large" color="yellow" />
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        )}

        {/* Modal Filter */}
        <Modal visible={showFilters} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <Filter 
              onApplyFilters={applyFilters} 
              onClose={() => setShowFilters(false)}
              brands={brands}
              products={products}
            />
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
    flex: 1,
    fontFamily: 'Jersey 15',
  },
  yellowGlow: {
    textShadowColor: 'yellow',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  loginButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'yellow',
  },
  loginButtonText: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "bold",
  },
  productCard: {
    margin: 5,
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  productImage: {
    height: 150,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "white",
    fontFamily: 'Jersey 15',
  },
  productBrand: {
    color: "white",
    fontSize: 14,
    fontFamily: 'Jersey 15',
  },
  productPrice: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'Jersey 15',
  },
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: "transparent",
    marginTop: 5,
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
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'yellow',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  filterSortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  filterButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'Jersey 15',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  sortButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'Jersey 15',
  },
});

export default CollectionScreen;
