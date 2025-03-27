import api from './baseURL';

// Get all feedbacks for a product
export const fetchFeedbacks = async (productId) => {
  try {
    const response = await api.get(`/feedbacks/${productId}`);
    const feedbacks = Array.isArray(response.data.result) ? response.data.result : [];
    return feedbacks.map(feedback => ({
      _id: feedback._id,
      productId: feedback.productId, 
      userId: feedback.accountId,   
      userName: feedback.account.userName || 'Anonymous',
      rating: feedback.rate,
      feedback: feedback.content,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching feedbacks:', error.response?.data || error.message);
    throw error;
  }
};

// Create a new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const payload = {
      productId: feedbackData.productId, 
      rate: feedbackData.rating,
      content: feedbackData.feedback,
    };
    const response = await api.post(`/feedbacks`, payload);
    const newFeedback = response.data.formattedResult || response.data; 
    return {
      _id: newFeedback._id,
      productId: newFeedback.productId,
      userId: newFeedback.accountId,
      userName: newFeedback.userName || 'Anonymous',
      rating: newFeedback.rate,
      feedback: newFeedback.content,
      createdAt: newFeedback.createdAt,
      updatedAt: newFeedback.updatedAt,
    };
  } catch (error) {
    console.error('Error creating feedback:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing feedback
export const updateFeedback = async (feedbackId, feedbackData) => {
  try {
    const payload = {
      rate: feedbackData.rating,
      content: feedbackData.feedback,
    };
    const response = await api.put(`/feedbacks/${feedbackId}`, payload);
    const updatedFeedback = response.data.formattedResult || response.data; 
    return {
      _id: updatedFeedback._id,
      productId: updatedFeedback.productId,
      userId: updatedFeedback.accountId,
      userName: updatedFeedback.userName || 'Anonymous',
      rating: updatedFeedback.rate,
      feedback: updatedFeedback.content,
      createdAt: updatedFeedback.createdAt,
      updatedAt: updatedFeedback.updatedAt,
    };
  } catch (error) {
    console.error('Error updating feedback:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a feedback
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await api.delete(`/feedbacks/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting feedback:', error.response?.data || error.message);
    throw error;
  }
};