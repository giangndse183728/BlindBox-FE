import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Slider, Checkbox, FormControlLabel, Box, Grid, Typography, Button, Rating, Divider, Pagination, Select, MenuItem, FormControl } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Footer from "../../layouts/Footer";
import GlassCard from "../../components/Decor/GlassCard";
import { FaBoxOpen } from "react-icons/fa";
import { GiCardboardBoxClosed } from "react-icons/gi";

const Collectionpage = () => {

  const [products, setProducts] = useState([
    { id: 1, name: "Anime Blind Box", img: "/assets/blindbox1.png", price: 2999.99, brand: "Pop Mart", type: "Unbox", rating: 4.5 },
    { id: 2, name: "Superhero Surprise Pack", img: "/assets/blindbox1.png", price: 2500, brand: "My Kingdom", type: "Seal", rating: 4 },
    { id: 3, name: "Kawaii Collectibles", img: "/assets/blindbox1.png", price: 3200, brand: "Tokidoki", type: "Unbox", rating: 3 },
    { id: 4, name: "Gaming Loot Crate", img: "/assets/blindbox1.png", price: 1999.99, brand: "Funko", type: "Seal", rating: 5 },
    { id: 5, name: "Sci-Fi Mystery Box", img: "/assets/blindbox1.png", price: 4500, brand: "Mighty Jaxx", type: "Unbox", rating: 2 },
    { id: 6, name: "Cartoon Nostalgia Box", img: "/assets/blindbox1.png", price: 2800, brand: "Kidrobot", type: "Unbox", rating: 3 },
    { id: 7, name: "Fantasy Adventure Pack", img: "/assets/blindbox1.png", price: 3500, brand: "Pop Mart", type: "Seal", rating: 3.5 },
    { id: 8, name: "Retro Game Blind Box", img: "/assets/blindbox1.png", price: 4000, brand: "My Kingdom", type: "Unbox", rating: 1 },
    { id: 9, name: "Limited Edition Blind Box", img: "/assets/blindbox1.png", price: 4999.99, brand: "Tokidoki", type: "Seal", rating: 1.5 },
    { id: 10, name: "Horror Themed Surprise", img: "/assets/blindbox1.png", price: 2700, brand: "Funko", type: "Unbox", rating: 2.5 },
    { id: 11, name: "Marvel Blind Box", img: "/assets/blindbox1.png", price: 3300, brand: "Mighty Jaxx", type: "Seal", rating: 4 },
    { id: 12, name: "DC Comics Mystery Pack", img: "/assets/blindbox1.png", price: 3100, brand: "Kidrobot", type: "Unbox", rating: 3.5 },
    { id: 13, name: "Anime Limited Edition Box", img: "/assets/blindbox1.png", price: 3799.99, brand: "Pop Mart", type: "Seal", rating: 2 },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page")) || 1;
  const itemsPerPage = 9;

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = products
        .filter((product) => product.price >= appliedPriceRange[0] && product.price <= appliedPriceRange[1])
        .filter((product) => selectedBrand.length === 0 || selectedBrand.includes(product.brand))
        .filter((product) => selectedType.length === 0 || selectedType.includes(product.type))
        .filter((product) => selectedRating === 0 || product.rating >= selectedRating);
      
      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [products, appliedPriceRange, selectedBrand, selectedType, selectedRating]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event, value) => {
    navigate(`?page=${value}`);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleApplyPriceFilter = () => {
    setAppliedPriceRange(priceRange);
  };

  const handleBrandChange = (event) => {
    const value = event.target.value;
    setSelectedBrand((prev) =>
      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
    );
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setSelectedType((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleRatingChange = (event, newValue) => {
    setSelectedRating(newValue);
  };

  const handleClearFilters = () => {
    setPriceRange([0, 5000]);
    setAppliedPriceRange([0, 5000]);
    setSelectedBrand([]);
    setSelectedType([]);
    setSelectedRating(0);
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
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "black",
        overflowX: "hidden",
        backgroundImage: "url(/assets/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src="/assets/gif/collection-banner.gif"
        alt="Collection Banner"
        style={{
          width: "80%",
          height: 200,
          paddingTop: 90,
          display: "block",
          margin: "0 auto",
        }}
      />
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", p: 2, paddingTop: 2 }}>
        {/* Sidebar Filter */}
        <Box
          sx={{
            width: { xs: "100%", sm: 200 },
            border: "1px solid white",
            p: 2,
            color: "white",
            borderRadius: 1,
            height: "fit-content",
            position: "sticky",
            flexShrink: 0,
            top: 5
          }}
        >
          <Typography
            variant="h6"
            fontFamily="'Jersey 15', sans-serif"
            sx={{
              textAlign: "center",
              width: "100%",
              fontWeight: "bold",
              fontSize: "1.8rem",
            }}
          >
            Product Filter
          </Typography>

          {/* Price Range Filter */}
          <Typography>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
            sx={{ color: "white" }}
          />

          {/* Show Selected Price Range Below the Slider */}
          <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="body1">${priceRange[0]}</Typography>
            <Typography variant="body1">${priceRange[1]}</Typography>
          </Grid>

          {/* Apply Price Filter Button */}
          <Button
            variant="contained"
            sx={{
              bgcolor: "yellow",
              color: "black",
              borderRadius: 1,
              mt: 2,
              width: "100%",
              display: "block",
              textAlign: "center",
            }}
            onClick={handleApplyPriceFilter}
          >
            Apply
          </Button>

          {/* Brand Filter */}
          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <Typography sx={{ mt: 2 }}>Brand</Typography>
          {["Pop Mart", "My Kingdom", "Tokidoki", "Funko", "Mighty Jaxx", "Kidrobot"].map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrand.includes(brand)}
                  onChange={handleBrandChange}
                  value={brand}
                  sx={{ color: "white", "&.Mui-checked": { color: "yellow" }, }} />}
              label={brand}
            />
          ))}

          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <Typography>Type</Typography>
          {["Unbox", "Seal"].map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedType.includes(type)}
                  onChange={handleTypeChange}
                  value={type}
                  sx={{ color: "white", "&.Mui-checked": { color: "white" }, }} />}
              label={type} />
          ))}

          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <Typography sx={{ mt: 2 }}>Rating</Typography>
          <Rating
            name="rating-filter"
            value={selectedRating}
            onChange={handleRatingChange}
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" sx={{ color: "red", stroke: "white", strokeWidth: 1 }} />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ stroke: "white", strokeWidth: 1 }} />}
          />

          <Button
            variant="contained"
            sx={{
              bgcolor: "yellow",
              color: "black",
              borderRadius: 1,
              mt: 2,
              width: "100%",
              display: "block",
              textAlign: "center",
              "&:hover": { bgcolor: "darkyellow" },
            }}
            onClick={handleClearFilters}
          >
            Clear All
          </Button>

        </Box>

        {/* Product Section */}
        <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}>
          {/* Sorting Bar */}
          <Box
            sx={{
              p: 2,
              color: "white",
              borderRadius: 1,
              position: "sticky",
              width: "90%",
              mb: 2,
              top: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            {/* Left Side: Title */}
            <Typography
              fontFamily="'Jersey 15', sans-serif"
              sx={{
                fontSize: '4rem',
                fontWeight: "bold",
              }}>
              BLINDBOXES
            </Typography>

            {/* Right Side: Sort by + Select Box */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1, gap: 2 }}>
              <Typography sx={{ fontSize: '1.5rem', }}>Sort by:</Typography>
              <FormControl sx={{ width: 200 }}>
                <Select
                  defaultValue=""
                  onChange={(event) => sortProducts(event.target.value)}
                  sx={{
                    color: "white",
                    border: "1px solid white",
                    backgroundColor: "transparent",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& .MuiPaper-root": {
                      backgroundColor: "transparent !important",
                    },
                    "& .MuiMenuItem-root": {
                      color: "white",
                      backgroundColor: "transparent !important",
                    },
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: "rgba(255,255,255,0.2) !important",
                    }
                  }}
                >
                  <MenuItem value="az">A-Z</MenuItem>
                  <MenuItem value="za">Z-A</MenuItem>
                  <MenuItem value="low-high">Lowest to Highest</MenuItem>
                  <MenuItem value="high-low">Highest to Lowest</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          {/* Product Grid */}
          <Grid container spacing={1}>
            {displayedProducts
              .filter((product) => product.price >= appliedPriceRange[0] && product.price <= appliedPriceRange[1])
              .filter((product) => selectedBrand.length === 0 || selectedBrand.includes(product.brand))
              .filter((product) => selectedType.length === 0 || selectedType.includes(product.type))
              .filter((product) => selectedRating === 0 || product.rating >= selectedRating)
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id} sx={{ p: 1 }}>
                  <GlassCard sx={{ width: "340px", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
                    <Box sx={{
                      borderRadius: 1,
                      p: 12,
                      textAlign: "center",
                      color: "white",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "150px",
                      width: "180px",
                    }}>
                      {/* Icon display */}
                      <Box sx={{
                        position: "absolute",
                        top: 10,
                        right: 15,
                        color: "gray",
                      }}>
                        {product.type === "Unbox" ? (
                          <FaBoxOpen size={30} />
                        ) : (
                          <GiCardboardBoxClosed size={34} />
                        )}
                      </Box>
                      {/* Only the image is clickable */}
                      <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                        <img
                          src={product.img}
                          alt={product.name}
                          style={{ width: 200, height: 200, borderRadius: "10px", marginTop: "-70px", cursor: "pointer" }}
                        />
                      </Link>
                      {/* Brand & Price in Bottom Left Corner */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          textAlign: "left",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: "bold", mt: "-15px" }}>{product.name}</Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                          {product.brand}
                        </Typography>
                        <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Rating
                          name={`product-rating-${product.id}`}
                          value={product.rating} // Use the product's rating value
                          readOnly
                          precision={0.5}
                          icon={<FavoriteIcon fontSize="inherit" sx={{ color: "red", stroke: "white", strokeWidth: 1 }} />}
                          emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ stroke: "white", strokeWidth: 1 }} />}
                        />
                      </Box>
                    </Box>
                  </GlassCard>
                </Grid>
              ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  fontSize: '1.1rem',
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: 'rgba(255, 255, 0, 0.5)',
                },
                '& .Mui-selected': {
                  backgroundColor: 'yellow !important',
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }
              }}
            />
          </Box>
        </Box>
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
    </Box >
  );
};

export default Collectionpage;
