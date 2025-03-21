import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Box, Typography, Button, Grid, Rating, Avatar, Divider, TextField, Paper, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ProductNotFound from "./ProductNotFound";
import { fetchBlindboxDetails } from '../../services/productApi';
import ButtonCus from "../../components/Button/ButtonCus";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useCartStore from '../Shoppingcart/CartStore';
import LoadingScreen from '../../components/Loading/LoadingScreen';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GlassCard from "../../components/Decor/GlassCard";
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import ProductFeedback from './ProductFeedback';

const Detailpage = () => {
    const { slug } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    
    // Keep the userInfo state for other parts of the component
    const [userInfo, setUserInfo] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { id: 'guest-user', username: 'Guest' };
    });

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                if (!id) {
                    throw new Error("No ID provided");
                }
                const data = await fetchBlindboxDetails(slug, id);
                console.log("Fetched Product Data:", data);

                if (data.result) {
                    setProduct(data.result);
                } else {
                    throw new Error("Product details not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getProductDetails();
    }, [slug, id]);

    if (loading) return <LoadingScreen />;
    if (error) return <ProductNotFound />;
    if (!product) return <ProductNotFound />;

    // Check if product has accessories
    const hasAccessories = product.accessories && product.accessories.length > 0;
    
    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const increaseQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Add a handler for feedback actions from the ProductFeedback component
    const handleFeedbackAction = (result) => {
        setSnackbar({
            open: true,
            message: result.message,
            severity: result.type
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/assets/background.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
                zIndex: -2,
            }} />
            <GlassCard theme="dark" isBlur={true} sx={{
                top: 100,
                position: "relative",
                margin: "auto",
                p: 7,
                borderRadius: 4,
                width: "90%",
                boxShadow: 3
            }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: 550, height: 450, borderRadius: "10px" }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ color: "white" }}>
                        <Typography variant="h4" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 40, color: "white" }}>
                            {product.name}
                        </Typography>

                        <Link to="/Collection-page" style={{ textDecoration: "none" }}>
                            <Button variant="contained" sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "transparent",
                                color: "white",
                                "&:hover": { bgcolor: "yellow", color: "black" }
                            }}>
                                <Typography fontFamily="'Jersey 15', sans-serif">Back to Collection</Typography>
                            </Button>
                        </Link>
                        <Typography sx={{
                            fontSize: 19, mt: 2,
                            color: "gray",
                            opacity: 0.7
                        }}>
                            By: {product.createdBy || "Unknown User"}
                        </Typography>

                        <Divider sx={{ bgcolor: "white", my: 2, opacity: 0.7 }} />
                        <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 30, mt: 1 }}>Brand: {product.brand || "Unknown"}</Typography>
                        <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 40, mt: 1, ...yellowGlowAnimation }}>
                            Price: ${price.toFixed(2)}
                        </Typography>
                        
                        {/* Show rating only if product doesn't have accessories */}
                        {!hasAccessories && (
                            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 30, mr: 2 }}>Rating:</Typography>
                                <Rating
                                    name="product-rating"
                                    value={product.rating || 0}
                                    readOnly
                                    precision={0.1}
                                    icon={<FavoriteIcon sx={{ color: "red" }} />}
                                    emptyIcon={<FavoriteBorderIcon sx={{ color: "red" }} />}
                                />
                                <Typography fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 25, ml: 1, color: "white" }}>{(product.rating || 0).toFixed(1)}</Typography>
                            </Box>
                        )}

                        {/* Show quantity controls only if product doesn't have accessories */}
                        {!hasAccessories && (
                            <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 25, mr: 2 }}>
                                    Quantity
                                </Typography>
                                <Button
                                    variant="outlined"
                                    sx={{ color: "white", border: "1px solid yellow" }}
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 30, mx: 2 }}>
                                    {quantity}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    sx={{ color: "white", border: "1px solid yellow" }}
                                    onClick={increaseQuantity}
                                    disabled={quantity >= product.quantity}
                                >
                                    +
                                </Button>
                                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: 25, ml: 2 }}>
                                    <span style={{ color: product.quantity === 0 ? "red" : product.quantity < 10 ? "yellow" : "darkgreen" }}>
                                        {product.quantity === 0 ? "❌ Out of Stock" : product.quantity < 10 ? `⚠️ Only ${product.quantity} pieces left in stock!` : `✅ ${product.quantity} pieces available`}
                                    </span>
                                </Typography>
                            </Box>
                        )}

                        {/* Show buttons only if product doesn't have accessories */}
                        {!hasAccessories && (
                            <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        border: "2px solid #f8b400",
                                        backgroundColor: "transparent",
                                        color: "#f8b400",
                                        width: "30%",
                                        height: "50px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        "&:hover": {
                                            backgroundColor: "#f8b400",
                                            color: "black",
                                            "& .cart-icon": { color: "black" }
                                        }
                                    }}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCartOutlinedIcon className="cart-icon" sx={{ fontSize: 22, color: "inherit" }} />
                                    <Typography variant="h5" fontFamily="'Jersey 15', sans-serif">
                                        Add to Cart
                                    </Typography>
                                </Button>

                                <ButtonCus variant="button-pixel-green" width="200px" height="50px">
                                    <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                        Buy now
                                    </Typography>
                                </ButtonCus>
                            </Box>
                        )}
                    </Grid>
                </Grid>
                <Box sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}>
                    <img src="/assets/gif/giphy.gif" alt="Kirby" style={{ width: '70px', height: 'auto' }} />
                </Box>
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                }}>
                    <img src="/assets/gif/giphy.gif" alt="Kirby" style={{ width: '70px', height: 'auto' }} />
                </Box>
            </GlassCard>
            
            {/* Description and Feedback Sections */}
            <Box sx={{ mt: 5, top: 130, position: "relative", margin: "auto", width: "100%", maxWidth: "1400px", px: 2 }}>
                {/* Description Section */}
                <Box sx={{ mb: 5 }}>
                    <Typography 
                        variant="h4" 
                        fontFamily="'Jersey 15', sans-serif" 
                        sx={{ 
                            fontSize: 40, 
                            color: "#f8b400", 
                            mb: 2, 
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        Description
                        <Divider sx={{ 
                            ml: 2, 
                            flex: 1, 
                            borderColor: 'rgba(248, 180, 0, 0.3)',
                            borderWidth: 1
                        }} />
                    </Typography>
                    <Box sx={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                        p: 3, 
                        borderRadius: 2,
                        borderLeft: '4px solid #f8b400'
                    }}>
                        <Typography 
                            sx={{ 
                                fontSize: 19, 
                                color: "white", 
                                lineHeight: 1.8
                            }}
                        >
                            {product.description || "No description available."}
                        </Typography>
                    </Box>
                </Box>

                {/* Feedback Section - only if product doesn't have accessories */}
                {!hasAccessories && (
                    <Box sx={{ mt: 6, width: "100%" }}>
                        <ProductFeedback 
                            productId={id} 
                            productName={product.name}
                            onFeedbackAction={handleFeedbackAction}
                        />
                    </Box>
                )}
            </Box>
            
            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        fontFamily: "'Jersey 15', sans-serif",
                        fontSize: '1rem',
                        alignItems: 'center'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Detailpage;