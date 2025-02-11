import React from 'react';
import { View, StyleSheet } from 'react-native';
import DeepLinkText from './DeepLinkText';

export default function DeepLinkScreen () {
  return (
    <View style={styles.container}>
      <DeepLinkText url={`https://www.blakkuweb.com.ng`} text="Click here to open Screen Name" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

