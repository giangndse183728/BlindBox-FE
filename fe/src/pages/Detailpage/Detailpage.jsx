import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button, Grid, Rating, Avatar } from "@mui/material";
import ProductNotFound from "./ProductNotFound";
import { fetchBlindboxDetails } from '../../services/productApi';
import ButtonCus from "../../components/Button/ButtonCus";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Detailpage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProductDetails = async () => {
            console.log("Fetching details for slug:", slug);
            try {
                const data = await fetchBlindboxDetails(slug);
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getProductDetails();
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <ProductNotFound />;

    const feedbackList = product.feedback || [];

    return (
        <Box sx={{ bgcolor: "#666", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundImage: "url(/assets/background.jpeg)", backgroundSize: "cover", backgroundPosition: "center" }}>
            <Box sx={{ position: "relative", p: 4, borderRadius: 4, width: 1400, boxShadow: 3 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        <img src={product.img} alt={product.name} style={{ width: 500, height: 500, borderRadius: "10px" }} />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ color: "white" }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f8b400" }}>{product.name}</Typography>

                        <Link to="/Collection-page" style={{ textDecoration: "none" }}>
                            <Button variant="contained" sx={{ position: "absolute", top: 90, right: 10, bgcolor: "black", color: "white", "&:hover": { bgcolor: "yellow", color: "black" } }}>
                                <Typography fontFamily="'Jersey 15', sans-serif">Back to Collection</Typography>
                            </Button>
                        </Link>

                        <Typography variant="h6" sx={{ mt: 1 }}>Brand: {product.brand}</Typography>
                        <Typography variant="h5" sx={{ mt: 1, color: "#ff4444" }}>Price: ${product.price.toFixed(2)}</Typography>
                        <Typography sx={{ mt: 2 }}>{product.description}</Typography>
                        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                            <Typography variant="h6" sx={{ mr: 2 }}>Rating:</Typography>
                            <Rating name="product-rating" value={product.rating} readOnly precision={0.1} icon={<FavoriteIcon sx={{ color: "red" }} />} emptyIcon={<FavoriteBorderIcon sx={{ color: "red" }} />} />
                            <Typography sx={{ ml: 1, color: "white" }}>{product.rating.toFixed(1)}</Typography>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <ButtonCus variant="button-pixel-red" width="20%" height="40px">
                                <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                    Add to Cart
                                </Typography>
                            </ButtonCus>
                        </Box>
                    </Grid>
                </Grid>

                {/* Feedback Section */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" sx={{ color: "#f8b400", mb: 2 }}>Feedback</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography variant="h4" sx={{ color: "#f8b400", mr: 2 }}>{product.rating.toFixed(1)}</Typography>
                        <Rating value={product.rating} readOnly precision={0.1} />
                        <Typography sx={{ ml: 1, color: "white" }}>({feedbackList.length} reviews)</Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        {feedbackList.map((fb, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", bgcolor: "white", p: 2, borderRadius: 1, mb: 1 }}>
                                <Avatar sx={{ mr: 2 }}>{fb.user.charAt(0)}</Avatar>
                                <Box>
                                    <Typography variant="h6">{fb.user}</Typography>
                                    <Rating value={fb.rating} readOnly precision={0.1} />
                                    <Typography>{fb.comment}</Typography>
                                    <Typography variant="caption" sx={{ color: "gray" }}>{fb.time}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Detailpage;