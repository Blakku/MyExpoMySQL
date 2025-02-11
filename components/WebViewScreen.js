import React from 'react';
import { WebView } from 'react-native-webview';

export default function WebViewScreen(){
  return (
    <WebView
      source={{ uri: 'https://www.crystaluxury.com.ng' }}
      style={{ flex: 1 }}
    />
  );
};

