import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchBlindboxDetails } from "../../service/productApi";
import { fetchFeedbacks, createFeedback, updateFeedback, deleteFeedback } from "../../service/feedbackApi";
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

  // Feedback-related state
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editFeedbackText, setEditFeedbackText] = useState('');

  // Check authentication and fetch user ID
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        const userId = await AsyncStorage.getItem("userId");
        if (!token) {
          Alert.alert("You need to login to see detail", "Please login again.");
          navigation.replace("Login");
        } else {
          setCurrentUserId(userId);
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

  // Fetch feedbacks for the product
  useEffect(() => {
    
    const loadFeedbacks = async () => {
      try {
        setFeedbackLoading(true);
        const feedbackData = await fetchFeedbacks(productId);

        setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);
      } catch (err) {
        console.error('Failed to load feedbacks:', err);
        Alert.alert('Error', 'Failed to load feedbacks.');
        setFeedbacks([]);
      } finally {
        setFeedbackLoading(false);
      }
    };

    loadFeedbacks();
  }, [productId]);

  const handleQuantityChange = (increment) => {
    const newQuantity = quantity + increment;
    if (newQuantity < 1) {
      Alert.alert("Invalid Quantity", "Quantity must be at least 1.");
      return;
    }
    if (product && newQuantity > product.product.quantity) {
      Alert.alert("Maximum Quantity", `You can't add more than ${product.product.quantity} items (Available stock).`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
      Alert.alert("Success", "Product added to cart!");
    } catch (error) {
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };

  const handleEditRatingPress = (star) => {
    setEditRating(star);
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedbackId(feedback._id);
    setEditRating(feedback.rating);
    setEditFeedbackText(feedback.feedback);
  };

  const handleUpdateFeedback = async () => {
    if (editRating === 0) {
      Alert.alert('Error', 'Please provide a rating.');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const updatedFeedback = await updateFeedback(editingFeedbackId, {
        rating: editRating,
        feedback: editFeedbackText,
      });
      setFeedbacks(
        feedbacks.map((fb) =>
          fb._id === editingFeedbackId ? updatedFeedback : fb
        )
      );
      setEditingFeedbackId(null);
      setEditRating(0);
      setEditFeedbackText('');
      Alert.alert('Success', 'Feedback updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    Alert.alert(
      'Delete Feedback',
      'Are you sure you want to delete this feedback?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFeedback(feedbackId);
              setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
              Alert.alert('Success', 'Feedback deleted successfully!');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete feedback.');
            }
          },
        },
      ]
    );
  };

  const calculateAverageRating = () => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (totalRating / feedbacks.length).toFixed(1);
  };

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <ImageBackground source={require("../../assets/background.jpeg")} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: product.product.image }} style={styles.productImage} />
          <Card.Content>
            <Text style={styles.productName}>{product.product.name}</Text>
            <Text style={styles.productBrand}>Brand: {product.product.brand}</Text>
            <Text style={styles.productPrice}>${Number(product.product.price).toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              {averageRating > 0 ? (
                <>
                  <Text style={styles.averageRating}>{averageRating}</Text>
                  <Icon name="star" size={20} color="#FFD700" />
                  <Text style={styles.reviewCount}>({feedbacks.length} reviews)</Text>
                </>
              ) : (
                <Text style={styles.noReviews}>No reviews yet</Text>
              )}
            </View>
            <Text style={styles.stockInfo}>Available Stock: {product.product.quantity}</Text>

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
                    quantity >= product.product.quantity && styles.disabledButton,
                  ]}
                  disabled={quantity >= product.product.quantity}
                >
                  <Text
                    style={[
                      styles.quantityButton,
                      quantity >= product.product.quantity && styles.disabledButtonText,
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              {quantity >= product.product.quantity && (
                <Text style={styles.maxQuantityText}>(Maximum stock reached)</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.addToCartButton,
                quantity > product.product.quantity && styles.disabledButton,
              ]}
              onPress={handleAddToCart}
              disabled={quantity > product.product.quantity}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.productDescription}>{product.product.description}</Text>
            </View>

            {/* Feedback Section */}
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>Feedback & Ratings</Text> 
              {/* Display Feedbacks */}
              <View style={styles.feedbackList}>
                <Text style={styles.sectionSubtitle}>User Feedback:</Text>
                {feedbackLoading ? (
                  <ActivityIndicator size="small" color="#f8b400" />
                ) : !Array.isArray(feedbacks) || feedbacks.length === 0 ? (
                  <Text style={styles.noFeedbackText}>No feedback yet. Be the first to leave a review!</Text>
                ) : (
                  feedbacks.map((feedback) => (
                    <View key={feedback._id} style={styles.feedbackItem}>
                      {editingFeedbackId === feedback._id ? (
                        // Edit Feedback Form
                        <View style={styles.editFeedbackSection}>
                          <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <TouchableOpacity
                                key={star}
                                onPress={() => handleEditRatingPress(star)}
                                style={styles.starButton}
                              >
                                <Icon
                                  name={star <= editRating ? 'star' : 'star-border'}
                                  size={24}
                                  color={star <= editRating ? '#FFD700' : 'white'}
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
                          <TextInput
                            style={styles.feedbackInput}
                            value={editFeedbackText}
                            onChangeText={setEditFeedbackText}
                            multiline
                            numberOfLines={4}
                          />
                          <View style={styles.editButtonsContainer}>
                            <TouchableOpacity
                              style={styles.saveButton}
                              onPress={handleUpdateFeedback}
                              disabled={isSubmittingFeedback}
                            >
                              <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={() => setEditingFeedbackId(null)}
                            >
                              <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        // Display Feedback
                        <>
                          <View style={styles.feedbackHeader}>
                            <Text style={styles.feedbackUser}>{feedback.userName || 'Anonymous'}</Text>
                            <View style={styles.feedbackRating}>
                              {Array.from({ length: 5 }, (_, index) => (
                                <Icon
                                  key={index}
                                  name={index < feedback.rating ? 'star' : 'star-border'}
                                  size={20}
                                  color={index < feedback.rating ? '#FFD700' : 'white'}
                                />
                              ))}
                            </View>
                          </View>
                          <Text style={styles.feedbackText}>{feedback.feedback || 'No comment provided.'}</Text>
                          {feedback.userId === currentUserId && (
                            <View style={styles.feedbackActions}>
                              <TouchableOpacity
                                onPress={() => handleEditFeedback(feedback)}
                                style={styles.actionButton}
                              >
                                <Text style={styles.actionButtonText}>Edit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDeleteFeedback(feedback._id)}
                                style={[styles.actionButton, styles.deleteButton]}
                              >
                                <Text style={styles.actionButtonText}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    overflow: "hidden",
  },
  productImage: {
    marginTop: 20,
    height: 300,
    backgroundColor: "transparent",
    borderRadius: 15,
  },
  productName: {
    fontSize: 24,
    marginBottom: 10,
    color: "white",
    fontFamily: 'Jersey 15',
    textAlign: "center",
  },
  productBrand: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Jersey 15',
    textAlign: "center",
  },
  productPrice: {
    color: "yellow",
    fontSize: 24,
    marginBottom: 15,
    fontFamily: 'Jersey 15',
    textAlign: "center",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  averageRating: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Jersey 15',
    marginRight: 5,
  },
  reviewCount: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Jersey 15',
    marginLeft: 5,
  },
  noReviews: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Jersey 15',
  },
  quantityContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
    fontFamily: 'Jersey 15',
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
    borderColor: 'white',
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    width: 24,
    textAlign: 'center',
    fontFamily: 'Jersey 15',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: 'white',
    fontFamily: 'Jersey 15',
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
    fontFamily: 'Jersey 15',
  },
  stockInfo: {
    color: 'yellow',
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'Jersey 15',
    textAlign: "center",
  },
  addToCartButton: {
    backgroundColor: 'yellow',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  addToCartButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Jersey 15',
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  descriptionTitle: {
    color: 'yellow',
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Jersey 15',
    textAlign: 'center',
  },
  productDescription: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Jersey 15',
    textAlign: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  notFoundText: {
    color: "white",
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Jersey 15',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Jersey 15',
  },
  backButton: {
    backgroundColor: '#f8b400',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Jersey 15',
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  feedbackTitle: {
    color: 'yellow',
    fontSize: 20,
    marginBottom: 15,
    fontFamily: 'Jersey 15',
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Jersey 15',
  },
  submitFeedbackSection: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  starButton: {
    marginHorizontal: 5,
  },
  feedbackInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    textAlignVertical: 'top',
    marginBottom: 15,
    fontFamily: 'Jersey 15',
  },
  submitFeedbackButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitFeedbackButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Jersey 15',
  },
  feedbackList: {
    marginTop: 10,
  },
  feedbackItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  feedbackUser: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Jersey 15',
  },
  feedbackRating: {
    flexDirection: 'row',
  },
  feedbackText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Jersey 15',
  },
  feedbackActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  actionButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Jersey 15',
  },
  deleteButton: {
    // Optional: Add specific styling for delete button if needed
  },
  noFeedbackText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Jersey 15',
  },
  editFeedbackSection: {
    padding: 10,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Jersey 15',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Jersey 15',
  },
});

export default DetailScreen;