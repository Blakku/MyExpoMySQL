import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, withSpring } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ParallaxAnimatedScrollViewScreen = () => {
  // Shared value for scroll position
  const scrollY = useSharedValue(0);

  // Scroll handler to update the scroll position
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Animated style for opacity of text
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(scrollY.value < screenHeight / 2 ? 1 : 0),
    };
  });

  // Image data
  const images = [
    { id: '1', src: 'https://via.placeholder.com/600x300?text=Image+1' },
    { id: '2', src: 'https://via.placeholder.com/600x300?text=Image+2' },
    { id: '3', src: 'https://via.placeholder.com/600x300?text=Image+3' },
    { id: '4', src: 'https://via.placeholder.com/600x300?text=Image+4' },
  ];

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {images.map((image) => (
          <View key={image.id} style={styles.imageContainer}>
            <Image
              source={{ uri: image.src }}
              style={styles.image}
              resizeMode="cover"
            />
            <Animated.View style={[styles.textContainer, animatedStyle]}>
              <Text style={styles.text}>Image {image.id}</Text>
            </Animated.View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: screenWidth,
    height: 300, // height of the image
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: 300, // height of the image
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ParallaxAnimatedScrollViewScreen;
