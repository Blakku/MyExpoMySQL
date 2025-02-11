import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet, Animated } from 'react-native';

export default function PanResponderScreen() {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.x, // x,y are Animated.Value
          dy: pan.y,
        },
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      // Place any logic you want to execute when the touch is released
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      />
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


