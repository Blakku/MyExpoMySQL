import React from 'react'; 
import { View, StyleSheet } from 'react-native'; 
import Svg,{Circle,Rect} from 'react-native-svg';

export default function SvgScreen() {
  return (
    <View style={styles.container}>
      <Svg height="100" width="100">
        <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
      </Svg>
      <Svg height="100" width="100">
         <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
