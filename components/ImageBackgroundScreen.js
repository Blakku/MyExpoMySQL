import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';

export default function ImageBackgroundScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: 'http://192.168.236.194:19001/assets/background_image.jpg'}}
        style={styles.imageBackground}
      >
        <Text style={styles.text}>Your content goes here</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // or 'contain'
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

