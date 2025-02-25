import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function WelcomeContent() {
  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.headerText}>Little Lemon</Text>
      </View>

      <Text style={styles.description}>
        Little Lemon is a charming neighborhood bistro that serves simple food
        and classic cocktails in a lively but casual environment. {'\n'}
        We would love to hear your experience with us!
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Màu nền tối giống trong ảnh
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 10, // Tạo khoảng cách giữa logo và tiêu đề
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
});
