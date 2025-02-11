import React from 'react';
import {  View, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Button } from 'react-native-elements';


export default function OrientationScreen() {
  const lockToPortrait = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };

  const lockToLandscape = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const unlockOrientation = () => {
    ScreenOrientation.unlockAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Lock to Portrait" onPress={lockToPortrait} />
      <Text></Text>
      <Button title="Lock to Landscape" onPress={lockToLandscape} />
      <Text></Text>
      <Button title="Unlock Orientation" onPress={unlockOrientation} />
    </View>
  );
};

