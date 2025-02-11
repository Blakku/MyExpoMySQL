import React,{useEffect,useState} from "react";
import { View,Text } from "react-native";
import { styles } from "../styles/styles";
import * as Location from "expo-location";

export default function LocationScreen() {
 const [location, setLocation] = useState(null);

 useEffect(()=>{
 (async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
    console.error('Location permission not granted');
    return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
 })();
 },[]);
    return(
        <View style={styles.container}>
         {location ? 
       ( <Text>
        Latitude: 
        {location.coords.latitude}, 
        Longitude: 
        {location.coords.longitude}
        </Text>)
        :
        (
            <Text>Loading Location....</Text>
        )
        }
        </View>
    )
}