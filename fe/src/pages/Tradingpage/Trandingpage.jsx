import { Typography, Box, Grid, Card, CardContent, CardMedia, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import React from "react";

const tradePosts = [
    {
        title: "Trade Post Title 1",
        author: "John Doe",
        description: "This trade post features a high-end designer jacket, perfect for winter. The jacket is made from premium materials and has only been worn a few times. Looking to trade for a similar quality item or a limited edition accessory.",
        status: "Open",
        createdAt: "2023-02-15",
        updatedAt: "2023-02-20",
        image: "/assets/blindbox1.png",
    },
    {
        title: "Trade Post Title 2",
        author: "Jane Smith",
        description: "Vintage handbag from a well-known brand, in excellent condition. Open to trade for sneakers or other branded items. Ideal for fashion enthusiasts who appreciate unique pieces.",
        status: "Pending",
        createdAt: "2023-02-16",
        updatedAt: "2023-02-21",
        image: "/assets/blindbox1.png",
    },
    {
        title: "Rare Sneaker Swap",
        author: "Alice Johnson",
        description: "Looking to trade a pair of rare limited edition sneakers for another exclusive pair. These sneakers are from a special collaboration collection and have only been worn once. The box and all original accessories are included.",
        status: "Open",
        createdAt: "2025-02-28",
        updatedAt: "2025-02-28",
        image: "/assets/blindbox1.png",
    },
    {
        title: "Vintage Jacket Exchange",
        author: "Michael Brown",
        description: "Trading my vintage leather jacket for a different size or style. The jacket is in great condition, made from genuine leather with a classic design. Looking for a similar jacket or other vintage apparel.",
        status: "Closed",
        createdAt: "2025-02-20",
        updatedAt: "2025-02-25",
        image: "/assets/blindbox1.png",
    }
];

const TradingPage = () => {
    return (
        <Box
            sx={{
                bgcolor: "#666",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: "url(/assets/background.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 2,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, width: '100%' }}>
                <Typography variant="h4" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white", fontSize: '4rem', textAlign: 'center', paddingTop: 10 }}>
                    Trading Center
                </Typography>
            </Box>
            <Grid container spacing={2} sx={{ maxWidth: "1200px", width: "100%", }}>
                {tradePosts.map((post, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ display: "flex", bgcolor: "transparent", border: "1px solid white", overflow: "hidden" }}>
                            <CardMedia
                                component="img"
                                sx={{ width: "18%", objectFit: "cover" }}
                                image={post.image}
                                alt={post.title}
                            />
                            <CardContent sx={{ width: "70%", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", padding: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: "white" }}>{post.title}</Typography>
                                    <Typography color="white" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>By: {post.author}</Typography>
                                    <Typography variant="body2" sx={{ marginBottom: 1, color: "white" }}>{post.description}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 2, color: "rgba(255, 255, 255, 0.7)" }}>
                                    <Typography>Created At: {post.createdAt}</Typography>
                                    <Typography>Updated At: {post.updatedAt}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 20, right: 20, border: "1px solid white" ,bgcolor: "rgba(0, 0, 0, 0.5)", '&:hover': { bgcolor: "yellow", color:"black" } }}>
                <Add />
            </Fab>
        </Box>
    );
};

export default TradingPage;
