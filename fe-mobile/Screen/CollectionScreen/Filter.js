import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Checkbox, Title } from "react-native-paper";
import Slider from "@react-native-community/slider";
import Icon from 'react-native-vector-icons/FontAwesome';

const Filter = ({ onApplyFilters, onClose }) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const brands = ["Pop Mart", "My Kingdom", "Tokidoki", "Funko", "Mighty Jaxx"];
  const types = ["Unbox", "Seal"];

  const handleBrandChange = (brand) => {
    setSelectedBrand((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApply = () => {
    onApplyFilters({ priceRange, selectedBrand, selectedType, selectedRating });
    onClose();
  };

  const handleClearAll = () => {
    setPriceRange([0, 5000]);
    setSelectedBrand([]);
    setSelectedType([]);
    setSelectedRating(0);
    onApplyFilters({
      priceRange: [0, 5000],
      selectedBrand: [],
      selectedType: [],
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
        maximumValue={5000}
        step={100}
        value={priceRange[1]}
        onValueChange={(value) => setPriceRange([0, value])}
        style={styles.slider}
      />
      <Text>${priceRange[0]} - ${priceRange[1]}</Text>
      <View style={styles.divider} />

      <Text style={styles.filterHeader}>Brand</Text>
      {brands.map((brand) => (
        <Checkbox.Item
          key={brand}
          label={brand}
          status={selectedBrand.includes(brand) ? "checked" : "unchecked"}
          onPress={() => handleBrandChange(brand)}
        />
      ))}
      <View style={styles.divider} />

      <Text style={styles.filterHeader}>Type</Text>
      {types.map((type) => (
        <Checkbox.Item
          key={type}
          label={type}
          status={selectedType.includes(type) ? "checked" : "unchecked"}
          onPress={() => handleTypeChange(type)}
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
              color={isFullHeart ? "red" : "lightgrey"}
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

      <Button mode="contained" onPress={handleApply} style={styles.button}>
        Apply
      </Button>
      <Button onPress={onClose} style={styles.button}>
        Close
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  filterHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    marginHorizontal: 5,
  },
  button: {
    marginTop: 10,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: 'red', 
  },
  clearButtonText: {
    color: 'white',
  },
});

export default Filter;