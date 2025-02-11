import React, { useRef } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function AnimatedFrameScreen() {
  const animation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true // Ensure that this is set to true for better performance
    }).start();
  };

  const interpolatedValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const animatedStyle = {
    transform: [{ rotate: interpolatedValue }]
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startAnimation}>
        <Text>Start Animation</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.box, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue'
  }
});

