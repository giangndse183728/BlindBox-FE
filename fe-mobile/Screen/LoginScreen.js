import { View, StyleSheet } from 'react-native'
import React from 'react'
import LoginHeader from '../components/LoginComponents/LoginHeader';
import LoginFooter from '../components/LoginComponents/LoginFooter';
import Content from '../components/LoginComponents/Content';

export default function LoginScreen() {
  return (
    <>
     <View style={styles.container}>
        <LoginHeader/>
        <Content/>
      </View>
      <View style={styles.footerContainer}>
        <LoginFooter/>
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