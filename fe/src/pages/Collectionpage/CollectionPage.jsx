import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Slider, Checkbox, FormControlLabel, Box, Grid, Typography, Button } from "@mui/material";

const Collectionpage = () => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 5000]);

  const [products, setProducts] = useState([
    { id: 1, name: "Anime Blind Box", img: "https://via.placeholder.com/150", price: 2999.99, brand: "Pop Mart" },
    { id: 2, name: "Superhero Surprise Pack", img: "https://via.placeholder.com/150", price: 2500, brand: "My Kingdom" },
    { id: 3, name: "Kawaii Collectibles", img: "https://via.placeholder.com/150", price: 3200, brand: "Tokidoki" },
    { id: 4, name: "Gaming Loot Crate", img: "https://via.placeholder.com/150", price: 1999.99, brand: "Funko" },
    { id: 5, name: "Sci-Fi Mystery Box", img: "https://via.placeholder.com/150", price: 4500, brand: "Mighty Jaxx" },
    { id: 6, name: "Cartoon Nostalgia Box", img: "https://via.placeholder.com/150", price: 2800, brand: "Kidrobot" },
    { id: 7, name: "Fantasy Adventure Pack", img: "https://via.placeholder.com/150", price: 3500, brand: "Pop Mart" },
    { id: 8, name: "Retro Game Blind Box", img: "https://via.placeholder.com/150", price: 4000, brand: "My Kingdom" },
    { id: 9, name: "Limited Edition Blind Box", img: "https://via.placeholder.com/150", price: 4999.99, brand: "Tokidoki" },
    { id: 10, name: "Horror Themed Surprise", img: "https://via.placeholder.com/150", price: 2700, brand: "Funko" },
    { id: 11, name: "Marvel Blind Box", img: "https://via.placeholder.com/150", price: 3300, brand: "Mighty Jaxx" },
    { id: 12, name: "DC Comics Mystery Pack", img: "https://via.placeholder.com/150", price: 3100, brand: "Kidrobot" },
    { id: 13, name: "Anime Limited Edition Box", img: "https://via.placeholder.com/150", price: 3799.99, brand: "Pop Mart" },
  ]);


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

  const sortProducts = (order) => {
    let sortedProducts = [...products];
    if (order === "az") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === "za") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (order === "low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (order === "high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  return (
    <Box sx={{ display: "flex", p: 2, bgcolor: "black", paddingTop: 10, minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      {/* Sidebar Filter */}
      <Box
        sx={{
          width: 300,
          p: 2,
          bgcolor: "#333",
          color: "white",
          borderRadius: 1,
          height: "fit-content",
          position: "sticky",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          fontFamily="'Jersey 15', sans-serif"
          sx={{
            textAlign: "center",
            width: "100%",
            fontWeight: "bold",
            fontSize: "1.8rem"
          }}>
          Product Filter
        </Typography>

        {/* Price Range Filter */}
        <Typography>Price</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={5000}
          sx={{ color: "white" }}
        />

        {/* Apply Price Filter Button */}
        <Button
          variant="contained"
          sx={{
            bgcolor: "#666",
            color: "white",
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
        <Typography sx={{ mt: 2 }}>Brand</Typography>
        {["Pop Mart", "My Kingdom", "Tokidoki", "Funko", "Mighty Jaxx", "Kidrobot"].map((brand) => (
          <FormControlLabel
            key={brand}
            control={<Checkbox checked={selectedBrand.includes(brand)} onChange={handleBrandChange} value={brand} />}
            label={brand}
          />
        ))}
      </Box>

      {/* Product Section */}
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        {/* Sorting Bar */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#333",
            color: "white",
            borderRadius: 1,
            position: "sticky",
            width: 1220,
            mb: 2,
          }}
        >
          {/* Sorting Buttons */}
          <Button
            variant="contained"
            sx={{ bgcolor: "#666", color: "white", borderRadius: 1, width: 120, height: 40, "&:hover": { bgcolor: "#888" }, "&:focus": { outline: "2px solid white" } }}
            onClick={() => sortProducts("az")}
          >
            A-Z
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#666", color: "white", borderRadius: 1, width: 120, height: 40, ml: 1, "&:hover": { bgcolor: "#888" }, "&:focus": { outline: "2px solid white" } }}
            onClick={() => sortProducts("za")}
          >
            Z-A
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#666", color: "white", borderRadius: 1, width: 200, height: 40, ml: 1, "&:hover": { bgcolor: "#888" }, "&:focus": { outline: "2px solid white" } }}
            onClick={() => sortProducts("low-high")}
          >
            Lowest to Highest
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#666", color: "white", borderRadius: 1, width: 200, height: 40, ml: 1, "&:hover": { bgcolor: "#888" }, "&:focus": { outline: "2px solid white" } }}
            onClick={() => sortProducts("high-low")}
          >
            Highest to Lowest
          </Button>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={2}>
          {products
            .filter((product) => product.price >= appliedPriceRange[0] && product.price <= appliedPriceRange[1])
            .filter((product) => selectedBrand.length === 0 || selectedBrand.includes(product.brand))
            .map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      bgcolor: "#222",
                      borderRadius: 1,
                      p: 9,
                      textAlign: "center",
                      color: "white",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "150px",
                      width: "250px",
                      border: "2px solid white",
                    }}
                  >
                    <img src={product.img} alt={product.name} style={{ width: "100%", borderRadius: "10px" }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>{product.name}</Typography>
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
                      <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                        {product.brand}
                      </Typography>
                      <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Collectionpage;
