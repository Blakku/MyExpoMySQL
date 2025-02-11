import React from 'react';
import { Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const DeepLinkText = ({ url, text }) => {
  const handlePress = async () => {
    // Attempt to open the deep link URL
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: ", url);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default DeepLinkText;
