import api from './baseURL';

// Get all feedbacks for a product
export const fetchFeedbacks = async (productId) => {
  try {
    const response = await api.get(`/feedbacks/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};

// Create a new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await api.post(`/feedbacks`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};

// Update an existing feedback
export const updateFeedback = async (feedbackId, feedbackData) => {
  try {
    const response = await api.put(`/feedbacks/${feedbackId}`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
};

// Delete a feedback
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await api.delete(`/feedbacks/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};
