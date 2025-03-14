import React, { useState } from "react";
import { View,ImageBackground } from "react-native";


const CartScreen = () => {

  return (
    <ImageBackground 
      source={require('./background.jpeg')} 
      style={styles.container}
    >
     <View>
        Cart Screen
     </View>
    </ImageBackground>
  );
};


export default CartScreen;