import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Checkbox, Title } from "react-native-paper";
import { Rating } from "react-native-ratings";
import Slider from "@react-native-community/slider";

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

  const handleApply = () => {
    onApplyFilters({ priceRange, selectedBrand, selectedType, selectedRating });
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Filters</Title>

      <Text>Price Range</Text>
      <Slider
        minimumValue={0}
        maximumValue={5000}
        step={100}
        value={priceRange[1]}
        onValueChange={(value) => setPriceRange([0, value])}
      />
      <Text>${priceRange[0]} - ${priceRange[1]}</Text>

      {brands.map((brand) => (
        <Checkbox.Item
          key={brand}
          label={brand}
          status={selectedBrand.includes(brand) ? "checked" : "unchecked"}
          onPress={() => handleBrandChange(brand)}
        />
      ))}

      <Rating
        ratingCount={5}
        imageSize={20}
        startingValue={selectedRating}
        onFinishRating={setSelectedRating}
      />

      <Button mode="contained" onPress={handleApply} style={{ marginTop: 10 }}>
        Apply
      </Button>

      <Button onPress={onClose} style={{ marginTop: 10 }}>
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
});

export default Filter;
