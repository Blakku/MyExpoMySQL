import { StyleSheet, Text, View, SafeAreaView, AppState, PixelRatio } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import RegistrationScreen from './components/RegistrationScreen';
import LoginScreen from './components/LoginScreen';
import LogoutScreen from './components/LogoutScreen';
import DashboardScreen from './components/DashboardScreen' 
import RegisterListScreen from './components/RegisterListScreen';
import PictureListScreen from './components/PictureListScreen';
import AddPictureScreen from './components/AddPictureScreen';
import EditPictureScreen from './components/EditPictureScreen';
import { AuthProvider } from './components/AuthProvider';
import CountryListScreen from './components/CountryListScreen';
import AddCountryScreen from './components/AddCountryScreen';
import EditCountryScreen from './components/EditCountryScreen';
import StateListScreen from './components/StateListScreen';
import AddStateScreen from './components/AddStateScreen';
import EditStateScreen from './components/EditStateScreen';
import CityListScreen from './components/CityListScreen';
import AddCityScreen from './components/AddCityScreen';
import EditCityScreen from './components/EditCityScreen';
import AddressListScreen from './components/AddressListScreen';
import AddAddressScreen from './components/AddAddressScreen';
import EditAddressScreen from './components/EditAddressScreen';
import { useEffect, useState, useRef } from 'react';
import CounterScreen from './components/CounterScreen';
import NotificationScreen from './components/NotificationScreen';
import AnimationScreen from './components/AnimationScreen';
import LocationScreen from './components/LocationScreen';
import BackgroundTaskScreen from './components/BackgroundTaskScreen';
import ParallaxScreen from './components/ParallexScreen';
import AnimatedFrameScreen from './components/AnimatedFrameScreen';
import WebViewScreen from './components/WebViewScreen';
import OrientationScreen from './components/OrientationScreen';
import ImageBackgroundScreen from './components/ImageBackgroundScreen';
import SvgScreen from './components/SvgScreen';
import DeepLinkScreen from './components/DeepLinkScreen';
import PanResponderScreen from './components/PanResponderScreen';
import PixelRatioImageScreen from './components/PixelRatioImageScreen';
import ParallaxAnimatedScrollViewScreen from './components/ParallaxAnimatedScrollViewScreen';

const Stack = createStackNavigator();

export default function App() {

const [appState,setAppState] = useState(AppState.currentState);

useEffect(()=>{
  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
    //Perform action based on the app state
    if(nextAppState === 'active'){
      console.log('App is in foreground');
    }
    else {
      console.log('App is in background');
    }
  };
  // Subscribe to app state changes
AppState.addEventListener('change',handleAppStateChange);
// unsubscribe when component unmounts
return () => {
  AppState.removeEventListener('change', handleAppStateChange);
};
},[]);

  return (
    <AuthProvider>

    <NavigationContainer>
    <SafeAreaView style={{flex: 1}}>

      <Stack.Navigator style={styles.container}  initialRouteName="Home">
        <Stack.Screen  name='Home' component={HomeScreen}/>
        <Stack.Screen name='Registration' component={RegistrationScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} />
        <Stack.Screen name='Register List' component={RegisterListScreen} />
        <Stack.Screen name='Picture List' component={PictureListScreen} />
        <Stack.Screen name='Add Picture' component={AddPictureScreen} />
        <Stack.Screen name='Edit Picture' component={EditPictureScreen} />
        <Stack.Screen name='Logout' component={LogoutScreen} />
        <Stack.Screen name='Country List' component={CountryListScreen} />
        <Stack.Screen name='Add Country' component={AddCountryScreen} />
        <Stack.Screen name='Edit Country' component={EditCountryScreen} />
        <Stack.Screen name='State List' component={StateListScreen} />
        <Stack.Screen name='Add State' component={AddStateScreen} />
        <Stack.Screen name='Edit State' component={EditStateScreen}/>
        <Stack.Screen name='City List' component={CityListScreen} />
        <Stack.Screen name='Add City' component={AddCityScreen} />
        <Stack.Screen name='Edit City' component={EditCityScreen}/>
        <Stack.Screen name='Address List' component={AddressListScreen} />
        <Stack.Screen name='Add Address' component={AddAddressScreen} />
        <Stack.Screen name='Edit Address' component={EditAddressScreen}/>
        <Stack.Screen name='Counter' component={CounterScreen} />
        <Stack.Screen name='Push Notifications' component={NotificationScreen} />
        <Stack.Screen name='Animation' component={AnimationScreen} />
        <Stack.Screen name='Location' component={LocationScreen} />
        <Stack.Screen name='Background Task' component={BackgroundTaskScreen} />
        <Stack.Screen name='Parallax' component={ParallaxScreen}/>
        <Stack.Screen name='Animated Frame' component={AnimatedFrameScreen}/>
        <Stack.Screen name='Web View' component={WebViewScreen} />
        <Stack.Screen name='Orientation' component={OrientationScreen} />
        <Stack.Screen name='Image Background' component={ImageBackgroundScreen}/>
        <Stack.Screen name='Svg' component={SvgScreen} />
        <Stack.Screen name='Deep Link' component={DeepLinkScreen} />
        <Stack.Screen name='Pan Responder' component={PanResponderScreen}/>
        <Stack.Screen name='Pixel Ratio Image' component={PixelRatioImageScreen} />
        <Stack.Screen name='Parallax Animated Scroll View' component={ParallaxAnimatedScrollViewScreen} />
      </Stack.Navigator>
      </SafeAreaView> 
    </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
