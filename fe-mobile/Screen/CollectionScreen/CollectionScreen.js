import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ActivityIndicator,
  Image,
} from "react-native";
import { Card, Title, Provider as PaperProvider, Menu } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import Filter from "./Filter";
import { fetchBlindboxData } from "../../service/productApi";
import { fetchFeedbacks } from "../../service/feedbackApi";

const CollectionScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brands, setBrands] = useState([]);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [productRatings, setProductRatings] = useState({}); // Store average ratings for each product
  const [productFeedbackCounts, setProductFeedbackCounts] = useState({}); // Store feedback counts

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchBlindboxData();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique brands from products
        const uniqueBrands = [...new Set(data.map(product => product.brand))];
        setBrands(uniqueBrands);

        // Fetch feedbacks and calculate average ratings for each product
        const ratings = {};
        const feedbackCounts = {};
        await Promise.all(
          data.map(async (product) => {
            try {
              const feedbacks = await fetchFeedbacks(product._id);
              const averageRating =
                feedbacks.length > 0
                  ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
                  : 0;
              ratings[product._id] = averageRating;
              feedbackCounts[product._id] = feedbacks.length;
            } catch (error) {
              console.error(`Error fetching feedbacks for product ${product._id}:`, error);
              ratings[product._id] = 0;
              feedbackCounts[product._id] = 0;
            }
          })
        );
        setProductRatings(ratings);
        setProductFeedbackCounts(feedbackCounts);
      } catch (error) {
        console.error('Error fetching products:', error.message);
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
    let filtered = [...products];

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
      filtered = filtered.filter((product) => (productRatings[product._id] || 0) >= selectedRating);
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
    <TouchableOpacity
      onPress={() => navigation.navigate("Detail", { productId: item._id, slug: item.slug })}
      accessibilityLabel={`View details for ${item.name}`}
    >
      <Card style={styles.productCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.productImage} />
        <Card.Content style={styles.cardContent}>
          <Title style={styles.productName}>{truncateName(item.name, 1)}</Title>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productPrice}>
            ${Number(item.price).toFixed(2)}
          </Text>

          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, index) => (
              <Icon
                key={index}
                name={index < Math.round(productRatings[item._id] || 0) ? "heart" : "heart"}
                size={12}
                color={index < Math.round(productRatings[item._id] || 0) ? "red" : "white"}
                style={styles.starIcon}
              />
            ))}
            <Text style={styles.ratingText}>
              ({(productRatings[item._id] || 0).toFixed(1)}) [{productFeedbackCounts[item._id]} reviews]
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <ImageBackground source={require('../../assets/background.jpeg')} style={styles.container}>
        {/* Header + Login/Profile Button */}
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.header, styles.yellowGlow]}>BlindB!ox</Text>
          </View>
          <View style={styles.buttonContainer}>
            {isLoggedIn ? (
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={styles.profileButton}
                activeOpacity={0.7}
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
                activeOpacity={0.7}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingHorizontal: 15,
    height: 100,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  header: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
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
    borderWidth: 1,
    borderColor: 'yellow',
    minWidth: 80,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "bold",
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
  productCard: {
    margin: 6, // Reduced margin for smaller cards
    flex: 1,
    maxWidth: '100%', // Ensure the card takes up less space in a 2-column layout
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10, // Slightly smaller border radius
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    elevation: 2, // Reduced elevation for a subtler shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  productImage: {
    height: 120, // Reduced image height for smaller cards
    backgroundColor: "transparent",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 8, // Reduced padding inside the card
    alignItems: 'center',
  },
  productName: {
    fontSize: 14, // Reduced font size
    fontWeight: "bold",
    color: "white",
    fontFamily: 'Jersey 15',
    textAlign: 'center',
    marginBottom: 2, // Reduced margin
  },
  productBrand: {
    color: "white",
    fontSize: 12, // Reduced font size
    fontFamily: 'Jersey 15',
    textAlign: 'center',
    marginBottom: 2,
  },
  productPrice: {
    color: "yellow",
    fontSize: 14, // Reduced font size
    fontWeight: "bold",
    fontFamily: 'Jersey 15',
    textAlign: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  starIcon: {
    marginHorizontal: 1, // Reduced spacing between stars
  },
  ratingText: {
    color: 'white',
    fontSize: 10, // Reduced font size
    marginLeft: 4, // Reduced margin
    fontFamily: 'Jersey 15',
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