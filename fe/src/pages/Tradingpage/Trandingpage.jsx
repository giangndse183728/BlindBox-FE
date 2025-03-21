import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Card, CardContent, CardMedia, Fab, Modal, TextField, IconButton } from "@mui/material";
import { Add, PhotoCamera, Message } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { tradingPostSchema } from '../../utils/validationSchemas';
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
    const [chatOpen, setChatOpen] = useState(false); 
    const [sortOrder, setSortOrder] = useState("recent"); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewPost({ title: "", author: "", description: "", image: "" });
        setImagePreview("");
    };

    const handleChatToggle = () => {
        setChatOpen(prev => !prev);
    };

    const handleSubmit = () => {
        console.log(newPost);
        setOpen(false);
        setNewPost({ title: "", author: "", description: "", image: "" });
        setImagePreview("");
    };

    const sortedPosts = [...tradePosts].sort((a, b) => {
        return sortOrder === "recent"
            ? new Date(b.createdAt) - new Date(a.createdAt) 
            : new Date(a.createdAt) - new Date(b.createdAt); 
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

            {/* Sorting Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <ButtonCus
                    variant="button-pixel-yellow"
                    onClick={() => setSortOrder("recent")}
                    sx={{
                        border: sortOrder === "recent" ? "1px solid white" : "none",
                        marginRight: 1,
                    }}
                >
                    Recent
                </ButtonCus>
                <ButtonCus
                    variant="button-pixel-yellow"
                    onClick={() => setSortOrder("oldest")}
                    sx={{
                        border: sortOrder === "oldest" ? "1px solid white" : "none",
                    }}
                >
                    Oldest
                </ButtonCus>
            </Box>

            {/* Card Grid */}
            <Grid container spacing={2} sx={{ maxWidth: "1200px", width: "100%" }}>
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
                                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }}>
                                    <ButtonCus
                                        variant="button-pixel-green"
                                        onClick={handleChatToggle}
                                        sx={{
                                            color: "white",
                                            bgcolor: "rgba(0, 0, 0, 0.5)",
                                            '&:hover': { bgcolor: "yellow", color: "black" }
                                        }}
                                    >
                                        Message
                                    </ButtonCus>
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
                    left: 20, 
                    border: "1px solid white",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    '&:hover': { bgcolor: "yellow", color: "black" }
                }} onClick={handleOpen}>
                <Add />
            </Fab>

            {/* Chat Box */}
            {chatOpen && (
                <Box sx={{
                    position: "fixed",
                    right: 0,
                    bottom: 10,
                    width: 300,
                    height: 400,
                    bgcolor: "white",
                    border: "2px solid black",
                    borderRadius: 2,
                    padding: 2,
                    boxShadow: 3,
                    zIndex: 10,
                }}>
                    <Typography variant="h6">Chat</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">This is the chat box. You can chat here!</Typography>
                    </Box>
                </Box>
            )}

            {/* Modal for New Post */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Formik
                        initialValues={newPost}
                        validationSchema={tradingPostSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            handleSubmit();
                        }}
                    >
                        {({ setFieldValue }) => (
                            <Form>
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
                                        }}
                                    >
                                        Add a New Trade Post
                                    </Typography>
                                    <Field
                                        name="title"
                                        as={TextField}
                                        autoFocus
                                        margin="dense"
                                        label="Title"
                                        placeholder="Write your title here"
                                        fullWidth
                                        variant="outlined"
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
                                    <ErrorMessage name="title" component="div" style={{ color: 'red' }} />

                                    <Field
                                        name="description"
                                        as={TextField}
                                        margin="dense"
                                        label="Description"
                                        placeholder="Tell us about your description"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
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
                                    <ErrorMessage name="description" component="div" style={{ color: 'red' }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <input
                                            accept="image/*"
                                            id="upload-image"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setImagePreview(reader.result);
                                                        setFieldValue('image', reader.result); 
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
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
                                    <ErrorMessage name="image" component="div" style={{ color: 'red' }} />

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
                                            type="submit" 
                                        >
                                            <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "white" }}>
                                                Submit
                                            </Typography>
                                        </ButtonCus>
                                    </Box>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </Box>
    );
};

export default TradingPage;