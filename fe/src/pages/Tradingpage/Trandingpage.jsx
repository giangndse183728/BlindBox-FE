import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Card, CardContent, CardMedia, Fab, Modal, TextField, IconButton, } from "@mui/material";
import { Add, PhotoCamera } from "@mui/icons-material";
import ButtonCus from "../../components/Button/ButtonCus";

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
    const [open, setOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", author: "", description: "", image: "" });
    const [imagePreview, setImagePreview] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewPost({ title: "", author: "", description: "", image: "" });
        setImagePreview("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewPost({ ...newPost, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        console.log(newPost);
        setOpen(false);
        setNewPost({ title: "", author: "", description: "", image: "" });
        setImagePreview("");
    };

    const [sortOrder, setSortOrder] = useState("recent");
    const sortedPosts = [...tradePosts].sort((a, b) => {
        if (sortOrder === "recent") {
            return new Date(b.createdAt) - new Date(a.createdAt); // Sort by recent
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt); // Sort by oldest
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


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
                <Typography
                    variant="h4"
                    fontFamily="'Jersey 15', sans-serif"
                    sx={{
                        color: "white",
                        fontSize: '4rem',
                        textAlign: 'center',
                        paddingTop: 10
                    }}>
                    Trading Center
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <ButtonCus
                    variant="button-pixel-yellow"
                    width="100%"
                    height="40px"
                    onClick={() => setSortOrder("recent")}
                    sx={{
                        border: sortOrder === "recent" ? "1px solid white" : "none",
                        marginRight: 1,
                    }}
                >
                    Recently Added
                </ButtonCus>
                <ButtonCus
                    variant="button-pixel-yellow"
                    width="100%"
                    height="40px"
                    onClick={() => setSortOrder("oldest")}
                    sx={{
                        border: sortOrder === "oldest" ? "1px solid white" : "none",
                    }}
                >
                    Oldest
                </ButtonCus>
            </Box>
            <Grid container spacing={2} sx={{ maxWidth: "1200px", width: "100%", }}>
                {sortedPosts.map((post, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ display: "flex", bgcolor: "transparent", border: "1px solid white", overflow: "hidden" }}>
                            <CardMedia
                                component="img"
                                sx={{ width: "18%", objectFit: "cover" }}
                                image={post.image}
                                alt={post.title}
                            />
                            <CardContent
                                sx={{
                                    width: "70%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    color: "white",
                                    padding: 2
                                }}>
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

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    border: "1px solid white",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    '&:hover': { bgcolor: "yellow", color: "black" }
                }} onClick={handleOpen}>
                <Add />
            </Fab>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: 'black',
                            border: '2px solid white',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            width: '600px',
                            height: 'auto',
                            maxHeight: '500px',
                            overflowY: 'auto',
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            fontFamily="'Jersey 15', sans-serif"
                            sx={{
                                textAlign: "center",
                                mb: 2,
                                color: "white",
                                fontSize: '2rem',
                            }}>
                            Add a New Trade Post
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Title"
                            placeholder="Write your title here"
                            fullWidth
                            variant="outlined"
                            value={newPost.title}
                            onChange={handleInputChange}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: 'white',
                                    },
                                    "&:hover fieldset": {
                                        borderColor: 'yellow',
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: 'yellow',
                                    },
                                },
                            }}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            placeholder="Tell us about your description"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            value={newPost.description}
                            onChange={handleInputChange}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: 'white',
                                    },
                                    "&:hover fieldset": {
                                        borderColor: 'yellow',
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: 'yellow',
                                    },
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <input
                                accept="image/*"
                                id="upload-image"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <label htmlFor="upload-image">
                                <IconButton color="primary" component="span">
                                    <PhotoCamera sx={{ color: "white" }} />
                                </IconButton>
                            </label>
                            <Typography variant="body2" sx={{ ml: 2, color: "white" }}>
                                {imagePreview ? "Image Uploaded" : "Upload Image"}
                            </Typography>
                        </Box>

                        {/* Image Preview */}
                        {imagePreview && (
                            <Box sx={{ mt: 2 }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        borderRadius: '4px'
                                    }} />
                            </Box>
                        )}

                        <Box justifyContent="space-between" sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <ButtonCus
                                variant="button-pixel-red"
                                width="100%"
                                height="40px"
                                onClick={handleClose}
                                sx={{ mr: 1 }}
                            >
                                <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                    Cancel
                                </Typography>
                            </ButtonCus>
                            <ButtonCus
                                variant="button-pixel-green"
                                width="100%"
                                height="40px"
                                onClick={handleSubmit}
                            >
                                <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                    Submit
                                </Typography>
                            </ButtonCus>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default TradingPage;