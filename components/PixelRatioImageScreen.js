import React from 'react';
import { View, Image, StyleSheet, PixelRatio, Text } from 'react-native';

export default function PixelRatioImageScreen() {
  // Define the width and height in logical pixels
  const imageWidth = 200;
  const imageHeight = 100;

  // Get the pixel ratio and convert the layout size to physical pixels
  const pixelRatio = PixelRatio.get();
  const imagePixelWidth = PixelRatio.getPixelSizeForLayoutSize(imageWidth);
  const imagePixelHeight = PixelRatio.getPixelSizeForLayoutSize(imageHeight);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://via.placeholder.com/${imagePixelWidth}x${imagePixelHeight}` }}
        style={{ width: imageWidth, height: imageHeight }}
      />
      <Text style={styles.text}>Logical Size: {imageWidth}x{imageHeight}</Text>
      <Text style={styles.text}>Pixel Size: {imagePixelWidth}x{imagePixelHeight}</Text>
      <Text style={styles.text}>Pixel Ratio: {pixelRatio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
});

