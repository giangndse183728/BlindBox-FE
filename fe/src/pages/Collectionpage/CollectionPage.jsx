
import React, { useState } from "react";
import { Slider, Checkbox, FormControlLabel, MenuItem, Select, Box, Grid, Typography } from "@mui/material";

const CollectionPage = () => {
  const [priceRange, setPriceRange] = useState([0, 24200]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [sortOption, setSortOption] = useState("");


  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleBrandChange = (event) => {
    const value = event.target.value;
    setSelectedBrand((prev) =>
      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
    );
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };


  const products = [
    {
      id: 1,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 2,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 3,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 4,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 5,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 6,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 7,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 8,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 9,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 10,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 11,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 12,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
    {
      id: 13,
      name: "Crybaby × Powerpuff",
      img: "https://via.placeholder.com/150",
      price: 4999.99,
    },
  ];

  return (

    <Box sx={{ display: 'flex', p: 2, bgcolor: 'black', paddingTop: 10, minHeight: '100vh' }}>
      {/* Sidebar Filter */}
      <Box sx={{
        width: { xs: '100%', sm: 800 }, // Responsive width
        p: 2,
        bgcolor: '#333',
        color: 'white',
        borderRadius: 1,
        height: 'fit-content',
        position: 'sticky',
        top: 80 // Adjust as needed
      }}>
        <Typography variant="h6">Product Filter</Typography>
        <Typography>Price</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={4000}
          sx={{ color: 'white' }}
        />
        <Typography>Brand</Typography>
        {["Redbull", "McLaren", "Mercedes", "Audi", "Toyota", "Porsche"].map((brand) => (
          <FormControlLabel
            key={brand}
            control={<Checkbox checked={selectedBrand.includes(brand)} onChange={handleBrandChange} value={brand} />}
            label={brand}
          />
        ))}
      </Box>

      {/* Product Section */}
      <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: 2 } }}>
        {/* Sorting Bar */}
        <Box sx={{
          p: 2,
          bgcolor: '#333',
          color: 'white',
          borderRadius: 1,
          position: 'sticky',
          top: 80, // Adjust as needed
          zIndex: 1,
          mb: 2
        }}>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            displayEmpty
            inputProps={{ "aria-label": "Sort Options" }}
            sx={{ bgcolor: '#666', color: 'white', borderRadius: 1 }}
          >
            <MenuItem value="" disabled>Alphabet</MenuItem>
            <MenuItem value="az">A-Z</MenuItem>
            <MenuItem value="za">Z-A</MenuItem>
          </Select>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            displayEmpty
            inputProps={{ "aria-label": "Sort Options" }}
            sx={{ bgcolor: '#666', color: 'white', borderRadius: 1 }}
          >
            <MenuItem value="" disabled>Price</MenuItem>
            <MenuItem value="low-high">Lowest Price</MenuItem>
            <MenuItem value="high-low">Highest Price</MenuItem>
          </Select>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Box sx={{ bgcolor: '#222', borderRadius: 1, p: 2, textAlign: 'center', color: 'white', position: 'relative' }}>
                <img src={product.img} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1">${product.price.toFixed(2)}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CollectionPage;