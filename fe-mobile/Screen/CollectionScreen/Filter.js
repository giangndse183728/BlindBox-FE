import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Checkbox, Title } from "react-native-paper";
import Slider from "@react-native-community/slider";
import Icon from 'react-native-vector-icons/FontAwesome';

const Filter = ({ onApplyFilters, onClose, brands, products }) => {
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(...products.map(product => product.price));
      setMaxPrice(highestPrice);
      setPriceRange([0, highestPrice]);
    }
  }, [products]);

  const handleBrandChange = (brand) => {
    setSelectedBrand((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleApply = () => {
    onApplyFilters({ 
      priceRange: [0, priceRange[1]], // Always start from 0
      selectedBrand, 
      selectedRating 
    });
    onClose();
  };

  const handleClearAll = () => {
    setPriceRange([0, maxPrice]);
    setSelectedBrand([]);
    setSelectedRating(0);
    onApplyFilters({
      priceRange: [0, maxPrice],
      selectedBrand: [],
      selectedRating: 0,
    });
    onClose();
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Filters</Title>

      <Text style={styles.filterHeader}>Price Range</Text>
      <Slider
        minimumValue={0}
        maximumValue={maxPrice}
        step={1}
        value={priceRange[1]}
        onValueChange={(value) => setPriceRange([0, value])}
        style={styles.slider}
        minimumTrackTintColor="yellow"
        maximumTrackTintColor="white"
        thumbTintColor="yellow"
      />
      <Text style={styles.priceText}>${priceRange[0]} - ${priceRange[1]}</Text>
      <View style={styles.divider} />

      <Text style={styles.filterHeader}>Brand</Text>
      {brands.map((brand) => (
        <Checkbox.Item
          key={brand}
          label={brand}
          status={selectedBrand.includes(brand) ? "checked" : "unchecked"}
          onPress={() => handleBrandChange(brand)}
          color="yellow"
          labelStyle={styles.checkboxLabel}
        />
      ))}
      <View style={styles.divider} />

      <Text style={styles.filterHeader}>Rating</Text>
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, index) => {
          const heartValue = index + 1;
          const isFullHeart = selectedRating >= heartValue;

          return (
            <Icon
              key={index}
              name="heart"
              size={30}
              color={isFullHeart ? "red" : "white"}
              onPress={() => setSelectedRating(heartValue)}
              style={styles.heartIcon}
            />
          );
        })}
      </View>
      <View style={styles.divider} />

      <Button 
        onPress={handleClearAll} 
        style={styles.clearButton} 
        labelStyle={styles.clearButtonText} 
      >
        Clear All Filters
      </Button>

      <Button 
        mode="contained" 
        onPress={handleApply} 
        style={styles.button}
        buttonColor="yellow"
        textColor="black"
      >
        Apply
      </Button>
      <Button 
        onPress={onClose} 
        style={styles.button}
        textColor="white"
      >
        Close
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    color: "white",
    fontFamily: 'Jersey 15',
  },
  filterHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
    fontFamily: 'Jersey 15',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  priceText: {
    color: "yellow",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    fontFamily: 'Jersey 15',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  heartIcon: {
    marginHorizontal: 5,
  },
  button: {
    marginTop: 10,
    borderColor: "white",
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
  clearButtonText: {
    color: 'white',
    fontFamily: 'Jersey 15',
  },
  checkboxLabel: {
    color: "white",
    fontFamily: 'Jersey 15',
  },
});

export default Filter;