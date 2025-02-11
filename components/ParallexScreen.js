import React, { useState } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Animated } from 'react-native';

const ParallaxScreen = () => {
  const [scrollY] = useState(new Animated.Value(0));

  const parallaxHeaderHeight = 200;
  const parallaxHeader = scrollY.interpolate({
    inputRange: [0, parallaxHeaderHeight],
    outputRange: [parallaxHeaderHeight, 50],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={[styles.parallaxHeader, { height: parallaxHeader }]}>
          <Image
            source={{ uri: 'https://via.placeholder.com/350x150' }}
            style={styles.headerImage}
          />
        </Animated.View>
        <View style={styles.content}>
          <Text style={styles.text}>Scroll down to see the parallax effect!</Text>
          {/* Add more content here */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  parallaxHeader: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ParallaxScreen;
