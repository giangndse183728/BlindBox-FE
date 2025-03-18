import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Slider,
  Checkbox,
  FormControlLabel,
  Box,
  Grid,
  Typography,
  Rating,
  Divider,
  Pagination,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import GlassCard from "../../components/Decor/GlassCard";
import Footer from "../../layouts/Footer";
import ButtonCus from "../../components/Button/ButtonCus";
import { yellowGlowAnimation } from '../../components/Text/YellowEffect';
import { fetchBlindboxData } from '../../services/productApi';
import LoadingScreen from '../../components/Loading/LoadingScreen';

const Collectionpage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page")) || 1;
  const itemsPerPage = 9;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBlindboxData();
        console.log("Fetched Data:", data);

        if (Array.isArray(data)) { // Kiểm tra nếu dữ liệu là mảng
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching blindbox data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = products
        .filter(product => product.price >= appliedPriceRange[0] && product.price <= appliedPriceRange[1])
        .filter(product => selectedBrand.length === 0 || selectedBrand.includes(product.brand))
        .filter(product => selectedRating === 0 || product.rating >= selectedRating);
      setFilteredProducts(filtered);
    };
    applyFilters();
  }, [products, appliedPriceRange, selectedBrand, selectedType, selectedRating]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : [];

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
    setSelectedBrand(prev =>
      prev.includes(value) ? prev.filter(b => b !== value) : [...prev, value]
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
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      bgcolor: "black",
      overflowX: "hidden",
      backgroundImage: "url(/assets/background.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
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
        <Box sx={{
          width: { xs: "100%", sm: 200 },
          border: "1px solid white",
          p: 2,
          color: "white",
          borderRadius: 1,
          height: "fit-content",
          position: "sticky",
          flexShrink: 0,
          top: 5
        }}>
          <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.8rem" }}>
            Product Filter
          </Typography>
          {/* Price Range Filter */}
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{fontSize:22}}>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={600}
            sx={{ color: "white" }}
          />
          <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="body1">${priceRange[0]}</Typography>
            <Typography variant="body1">${priceRange[1]}</Typography>
          </Grid>

          <ButtonCus variant="button-pixel-yellow" width="100%" height="40px" onClick={handleApplyPriceFilter}>
            <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "Seashell" }}>
              Apply
            </Typography>
          </ButtonCus>
          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ mt: 2, fontSize:22 }}>Brand</Typography>
          {["fpt", "Popmart"].map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrand.includes(brand)}
                  onChange={handleBrandChange}
                  value={brand}
                  sx={{ color: "white", "&.Mui-checked": { color: "yellow" } }}
                />
              }
              label={brand}
            />
          ))}
          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <Typography fontFamily="'Jersey 15', sans-serif" sx={{ mt: 2, fontSize:22 }}>Rating</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Rating
              name="rating-filter"
              value={selectedRating}
              onChange={handleRatingChange}
              precision={0.5}
              icon={<FavoriteIcon fontSize="inherit" sx={{ color: "red" }} />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ color: "white" }} />}
            />
          </Box>
          <Divider sx={{ bgcolor: "white", my: 2 }} />
          <ButtonCus variant="button-pixel-yellow" width="100%" height="40px" onClick={handleClearFilters}>
            <Typography variant="h5" fontFamily="'Jersey 15', sans-serif" sx={{ color: "Seashell" }}>
            Clear All
            </Typography>
          </ButtonCus>
        </Box>

        {/* Product Section */}
        <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}>
          {/* Sorting Bar */}
          <Box sx={{ p: 2, color: "white", borderRadius: 1, position: "sticky", width: "90%", mb: 2, top: 5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: '4rem', fontWeight: "bold",...yellowGlowAnimation }}>
              BLINDBOXES
            </Typography>
            <Autocomplete
              freeSolo
              options={products.map((product) => product.name)}
              onInputChange={(event, value) => {
                const filtered = products.filter((product) =>
                  product.name.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredProducts(filtered);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search Blindbox name"
                  sx={{
                    color: "white",
                    border: "0.5px solid white",
                    borderRadius: 2,
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                />
              )}
              sx={{ width: 325, mx: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1, gap: 2 }}>
              <Typography fontFamily="'Jersey 15', sans-serif" sx={{ fontSize: '1.5rem' }}>Sort by:</Typography>
              <FormControl sx={{ width: 120 }}>
                <Select
                  defaultValue=""
                  onChange={(event) => sortProducts(event.target.value)}
                  sx={{ color: "white", border: "1px solid white", backgroundColor: "transparent" }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="az">A-Z</MenuItem>
                  <MenuItem value="za">Z-A</MenuItem>
                  <MenuItem value="low-high">Lowest to Highest</MenuItem>
                  <MenuItem value="high-low">Highest to Lowest</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Loading Screen */}
          {loading ? (
            <LoadingScreen />
          ) : (
            <Grid container spacing={1}>
              {displayedProducts.length === 0 ? (
                <Typography variant="h6" fontFamily="'Jersey 15', sans-serif" color="white" sx={{ fontSize: "2.8rem" }}>
                  No products available.
                </Typography>
              ) : (
                displayedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.slug} sx={{ p: 1 }}>
                    <Link
                      to={`/product/${product.slug}?id=${product._id}`}
                      style={{ textDecoration: "none", width: "100%" }}
                    >
                      <GlassCard sx={{ width: "340px", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
                        <Box
                          sx={{
                            borderRadius: 1,
                            p: 12,
                            textAlign: "center",
                            color: "white",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "150px",
                            width: "180px"
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: 150, height: 150, borderRadius: "10px", marginTop: "-70px", cursor: "pointer" }}
                          />
                          <Box sx={{ position: "absolute", bottom: 10, left: 10, color: "white", px: 1, py: 0.5, borderRadius: 1, textAlign: "left" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mt: "-15px" }}>
                              {product.name.length > 27 ? `${product.name.substring(0, 24)}...` : product.name}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>{product.brand}</Typography>
                            <Typography variant="body1">
                              ${isNaN(parseFloat(product.price)) ? "N/A" : parseFloat(product.price).toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ position: "absolute", bottom: 10, right: 10, color: "white", px: 1, py: 0.5, borderRadius: 1, display: "flex", alignItems: "center" }}>
                            <Rating
                              name={`product-rating-${product.slug}`}
                              value={product.rating}
                              readOnly
                              precision={0.5}
                              icon={<FavoriteIcon fontSize="inherit" sx={{ color: "red" }} />}
                              emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ color: "white" }} />}
                            />
                          </Box>
                        </Box>
                      </GlassCard>
                    </Link>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': { color: 'white', fontSize: '1.1rem' },
                '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(255, 255, 0, 0.5)' },
                '& .Mui-selected': { backgroundColor: 'yellow !important', color: '#333', fontSize: '1.1rem', fontWeight: 'bold' }
              }}
            />
          </Box>
        </Box>
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
    </Box>
  );
};

export default Collectionpage;