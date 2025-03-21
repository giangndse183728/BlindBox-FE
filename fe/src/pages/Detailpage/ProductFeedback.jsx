import React, { useState, useEffect } from "react";
import { 
    Box, Typography, Button, Rating, Avatar, Divider, TextField, 
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import GlassCard from "../../components/Decor/GlassCard";
import { fetchFeedbacks, createFeedback, updateFeedback, deleteFeedback } from '../../services/feedbackApi';

const ProductFeedback = ({ productId, productName, onFeedbackAction }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // Get user info from localStorage
    const [userInfo] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { id: 'guest-user', username: 'Guest' };
    });

    useEffect(() => {
        const getFeedbacks = async () => {
            if (productId) {
                try {
                    const response = await fetchFeedbacks(productId);
                    if (response.formattedResult && Array.isArray(response.formattedResult)) {
                        const formattedFeedbacks = response.formattedResult.map(item => ({
                            _id: item._id,
                            rating: item.rate,
                            comment: item.content,
                            userId: item.accountId,
                            time: new Date(item.createdAt).toLocaleString(),
                            user: "User"
                        }));
                        setFeedbacks(formattedFeedbacks);
                    } else {
                        console.error("Unexpected feedback response format:", response);
                        setFeedbacks([]);
                    }
                } catch (err) {
                    console.error("Error fetching feedbacks:", err);
                    setFeedbacks([]);
                }
            }
        };

        getFeedbacks();
    }, [productId]);

    const handleSubmitFeedback = async () => {
        // Validate feedback length before submission
        if (!newFeedback.trim()) {
            onFeedbackAction({
                success: false,
                message: "Please write your feedback",
                type: "error"
            });
            return;
        }
        
        // Check feedback length (10-1000 characters)
        if (newFeedback.trim().length < 10 || newFeedback.trim().length > 1000) {
            onFeedbackAction({
                success: false,
                message: "Feedback must be between 10 and 1000 characters",
                type: "error"
            });
            return;
        }

        try {
            if (editingFeedback) {
                // Update existing feedback
                const response = await updateFeedback(editingFeedback._id, {
                    rate: newRating,
                    content: newFeedback
                });
                
                if (response.message && response.message.includes("success")) {
                    // Update the feedbacks list
                    setFeedbacks(feedbacks.map(f => 
                        f._id === editingFeedback._id 
                            ? { ...f, rating: newRating, comment: newFeedback } 
                            : f
                    ));
                    
                    onFeedbackAction({
                        success: true,
                        message: "Feedback updated successfully!",
                        type: "success"
                    });
                    
                    setEditingFeedback(null);
                    setNewFeedback("");
                    setNewRating(5);
                    setDialogOpen(false);
                } else {
                    throw new Error(response.message || "Failed to update feedback");
                }
            } else {
                // Create new feedback
                const response = await createFeedback({
                    productId: productId,
                    rate: newRating,
                    content: newFeedback
                });
                
                if (response.message && response.message.includes("success")) {
                    // Get the newly created feedback data
                    const newFeedbackData = response.formattedResult || response.data || {};
                    
                    // Add the new feedback to the list
                    const newFeedbackObj = {
                        _id: newFeedbackData._id,
                        rating: newRating,
                        comment: newFeedback,
                        time: new Date().toLocaleString(),
                        userId: userInfo.id,
                        user: userInfo.username || "You"
                    };
                    
                    setFeedbacks([...feedbacks, newFeedbackObj]);
                    
                    onFeedbackAction({
                        success: true,
                        message: "Feedback submitted successfully!",
                        type: "success"
                    });
                    
                    // Reset form
                    setNewFeedback("");
                    setNewRating(5);
                    setDialogOpen(false);
                } else {
                    throw new Error(response.message || "Failed to submit feedback");
                }
            }
        } catch (err) {
            
            // Handle validation errors from API
            if (err.response && err.response.data && err.response.data.errors) {
                const errorData = err.response.data;
                let errorMessage = "Validation error: ";
                
                // Extract the first error message
                const firstError = Object.values(errorData.errors)[0];
                if (firstError && firstError.msg) {
                    errorMessage += firstError.msg;
                } else {
                    errorMessage += "Please check your input and try again.";
                }
                
                onFeedbackAction({
                    success: false,
                    message: errorMessage,
                    type: "error"
                });
            } else {
                // Generic error message
                onFeedbackAction({
                    success: false,
                    message: err.message || "Failed to process your feedback. Please try again.",
                    type: "error"
                });
            }
        }
    };

    const handleEditFeedback = (feedback) => {
        setEditingFeedback(feedback);
        setNewRating(feedback.rating);
        setNewFeedback(feedback.comment);
        setDialogOpen(true);
    };

    const handleDeleteFeedback = async (feedbackId) => {
        try {
            await deleteFeedback(feedbackId);
            
            // Remove the deleted feedback from the list
            setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));
            
            onFeedbackAction({
                success: true,
                message: "Feedback deleted successfully!",
                type: "success"
            });
        } catch (err) {
            console.error("Error deleting feedback:", err);
            onFeedbackAction({
                success: false,
                message: "Failed to delete feedback. Please try again.",
                type: "error"
            });
        }
    };

    // Check if the current user is the author of the feedback
    const isAuthor = (feedback) => {
        return feedback.userId === userInfo.id;
    };

    // Calculate average rating
    const averageRating = feedbacks.length > 0 
        ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length 
        : 0;

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography 
                        variant="h4" 
                        fontFamily="'Jersey 15', sans-serif" 
                        sx={{ 
                            fontSize: { xs: 28, md: 40 },
                            color: "#f8b400",
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        Customer Reviews
                        <Typography 
                            variant="body1" 
                            component="span" 
                            sx={{ 
                                color: 'white', 
                                bgcolor: 'rgba(248, 180, 0, 0.2)', 
                                borderRadius: '20px',
                                px: 2,
                                py: 0.5,
                                fontSize: 16
                            }}
                        >
                            {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
                        </Typography>
                    </Typography>
                    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setDialogOpen(true)}
                        sx={{ 
                            bgcolor: "#f8b400", 
                            color: "black",
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            "&:hover": { bgcolor: "#d9a000" } 
                        }}
                    >
                        <Typography fontFamily="'Jersey 15', sans-serif">
                            Write a Review
                        </Typography>
                    </Button>
                </Box>
                
                <Divider sx={{ 
                    mb: 4, 
                    borderColor: 'rgba(248, 180, 0, 0.3)',
                    borderWidth: 1
                }} />
                
                {/* Rating summary */}
                <GlassCard sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    width: "80%", 
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    margin: "auto"
                }}>
                    {/* Rating number */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2
                    }}>
                        <Typography 
                            variant="h2" 
                            fontFamily="'Jersey 15', sans-serif" 
                            sx={{ 
                                fontSize: { xs: 40, md: 60 }, 
                                color: "#f8b400",
                                lineHeight: 1
                            }}
                        >
                            {averageRating.toFixed(1)}
                        </Typography>
                        <Rating 
                            value={averageRating} 
                            readOnly 
                            precision={0.1}
                            icon={<FavoriteIcon sx={{ color: "#f8b400" }} />}
                            emptyIcon={<FavoriteBorderIcon sx={{ color: "rgba(248, 180, 0, 0.5)" }} />}
                        />
                        <Typography 
                            fontFamily="'Jersey 15', sans-serif" 
                            sx={{ 
                                fontSize: 14, 
                                color: "white", 
                                mt: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            Average Rating
                        </Typography>
                    </Box>
                </GlassCard>
            </Box>
            
            {/* Feedback list - Horizontal layout */}
            <Box sx={{ 
                width: "100%", 
                mt: 4,
                position: "relative",
                overflowX: "auto", // Enable horizontal scrolling
                pb: 2 // Add padding bottom for scrollbar
            }}>
                {feedbacks.length === 0 ? (
                    <GlassCard sx={{ p: 4, textAlign: "center", mb: 3 }}>
                        <Typography variant="h6" sx={{ color: "white", mb: 2, fontFamily: "'Jersey 15', sans-serif" }}>
                            No reviews yet
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                            Be the first to share your thoughts about this product!
                        </Typography>
                    </GlassCard>
                ) : (
                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "row", // Row direction
                        gap: 3, // Space between cards
                        width: "max-content", // Allow content to extend beyond container
                        pb: 1 // For scrollbar space
                    }}>
                        {feedbacks.map((feedback) => (
                            <GlassCard 
                                key={feedback._id} 
                                sx={{ 
                                    p: 3, 
                                    position: "relative",
                                    transition: 'all 0.3s ease',
                                    minWidth: "350px", // Fixed minimum width
                                    maxWidth: "450px", // Maximum width
                                    height: "fit-content",
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                    {/* User info and rating */}
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                        <Avatar sx={{ 
                                            mr: 2, 
                                            bgcolor: "#f8b400",
                                            width: 45,
                                            height: 45,
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            flexShrink: 0
                                        }}>
                                            {feedback.user ? feedback.user.charAt(0).toUpperCase() : "U"}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ 
                                                display: "flex", 
                                                justifyContent: "space-between", 
                                                alignItems: "center", 
                                                width: "100%" 
                                            }}>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        color: "white", 
                                                        fontWeight: "bold", 
                                                        fontFamily: "'Jersey 15', sans-serif",
                                                        fontSize: 16
                                                    }}
                                                >
                                                    {feedback.user || "Anonymous"}
                                                </Typography>
                                                {isAuthor(feedback) && (
                                                    <Box>
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleEditFeedback(feedback)}
                                                            sx={{ 
                                                                color: "#f8b400",
                                                                p: 0.5,
                                                                '&:hover': { backgroundColor: 'rgba(248,180,0,0.1)' }
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleDeleteFeedback(feedback._id)}
                                                            sx={{ 
                                                                color: "#ff4444",
                                                                p: 0.5,
                                                                '&:hover': { backgroundColor: 'rgba(255,68,68,0.1)' }
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Rating 
                                                value={feedback.rating} 
                                                readOnly 
                                                precision={0.5}
                                                size="small"
                                                icon={<FavoriteIcon sx={{ color: "#f8b400" }} />}
                                                emptyIcon={<FavoriteBorderIcon sx={{ color: "rgba(248, 180, 0, 0.5)" }} />}
                                            />
                                        </Box>
                                    </Box>
                                    
                                    {/* Review text */}
                                    <Typography sx={{ 
                                        color: "white", 
                                        fontSize: 16,
                                        lineHeight: 1.6,
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        p: 2,
                                        borderRadius: 1,
                                        height: "100%",
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: "vertical",
                                        textOverflow: "ellipsis"
                                    }}>
                                        {feedback.comment}
                                    </Typography>
                                    
                                    {/* Date */}
                                    <Typography variant="caption" sx={{ 
                                        color: "rgba(255, 255, 255, 0.6)", 
                                        display: 'block', 
                                        mt: 1,
                                        textAlign: 'right',
                                        fontSize: 12
                                    }}>
                                        {feedback.time}
                                    </Typography>
                                </Box>
                            </GlassCard>
                        ))}
                    </Box>
                )}
                
                {/* Navigation indicators for horizontal scrolling */}
                {feedbacks.length > 1 && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mt: 2,
                        color: 'white'
                    }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            ← Scroll to see more reviews →
                        </Typography>
                    </Box>
                )}
            </Box>
            
            {/* Feedback Dialog */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => {
                    setDialogOpen(false);
                    setEditingFeedback(null);
                    setNewFeedback("");
                    setNewRating(5);
                }}
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        border: '1px solid rgba(248, 180, 0, 0.3)'
                    }
                }}
                fullWidth
            >
                <DialogTitle sx={{ 
                    color: "#f8b400", 
                    fontFamily: "'Jersey 15', sans-serif", 
                    fontSize: 28,
                    borderBottom: '1px solid rgba(248, 180, 0, 0.3)',
                    pb: 2
                }}>
                    {editingFeedback ? "Edit Your Review" : "Write a Review"}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography sx={{ color: "white", mb: 1, fontFamily: "'Jersey 15', sans-serif" }}>
                        {productName}
                    </Typography>
                    <Box sx={{ mb: 3, mt: 2 }}>
                        <Typography sx={{ color: "white", mb: 1 }}>Your Rating: <span style={{ color: '#f8b400' }}>{newRating}/5</span></Typography>
                        <Rating
                            name="feedback-rating"
                            value={newRating}
                            onChange={(e, newValue) => setNewRating(newValue || 1)} // Prevent null value
                            icon={<FavoriteIcon sx={{ color: "#f8b400", fontSize: 40 }} />}
                            emptyIcon={<FavoriteBorderIcon sx={{ color: "rgba(248, 180, 0, 0.5)", fontSize: 40 }} />}
                        />
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        placeholder="Share your thoughts about this product (minimum 10 characters)..."
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        InputProps={{
                            style: { color: 'white' }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(248, 180, 0, 0.5)',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#f8b400',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f8b400',
                                },
                            }
                        }}
                        helperText={
                            <Typography variant="caption" sx={{ 
                                color: newFeedback.length < 10 ? '#ff4444' : 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>{newFeedback.length < 10 ? "Minimum 10 characters required" : "Share your honest opinion"}</span>
                                <span>{newFeedback.length}/1000</span>
                            </Typography>
                        }
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1, borderTop: '1px solid rgba(248, 180, 0, 0.1)', mt: 2 }}>
                    <Button 
                        onClick={() => {
                            setDialogOpen(false);
                            setEditingFeedback(null);
                            setNewFeedback("");
                            setNewRating(5);
                        }}
                        sx={{ 
                            color: "white",
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={handleSubmitFeedback}
                        disabled={newFeedback.length < 10}
                        sx={{ 
                            bgcolor: newFeedback.length < 10 ? 'rgba(248, 180, 0, 0.5)' : "#f8b400", 
                            color: "black",
                            "&:hover": { 
                                bgcolor: newFeedback.length < 10 ? 'rgba(248, 180, 0, 0.5)' : "#d9a000" 
                            }
                        }}
                    >
                        {editingFeedback ? "Update Review" : "Submit Review"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductFeedback; 