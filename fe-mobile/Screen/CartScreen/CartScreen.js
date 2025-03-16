import React, { useState } from "react";
import { View,ImageBackground } from "react-native";


const CartScreen = () => {

  return (
    <ImageBackground 
      source={require('../../assets/background.jpeg')} 
    >
     <View>
        Cart Screen
     </View>
    </ImageBackground>
  );
};


export default CartScreen;