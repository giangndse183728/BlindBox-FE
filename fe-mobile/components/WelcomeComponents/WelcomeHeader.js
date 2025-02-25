import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Little Lemon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EE9972',
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
});