import { View, StyleSheet } from 'react-native';
import React from 'react';
import WelcomeFooter from '../components/WelcomeComponents/WelcomeFooter';
import WelcomeContent from '../components/WelcomeComponents/WelcomeContent';
import WelcomeHeader from '../components/WelcomeComponents/WelcomeHeader';

export default function WelcomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <WelcomeHeader />
        <WelcomeContent />
      </View>
      <View style={styles.footerContainer}>
        <WelcomeFooter />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  footerContainer: { backgroundColor: '#333333' },
});
