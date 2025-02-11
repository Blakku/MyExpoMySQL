import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {useAuth} from "./AuthProvider";
import {styles} from "../styles/styles";
import { Button,Input } from "react-native-elements";



export default function AddCountryScreen() {
const navigation = useNavigation();
const {token,user} = useAuth();
const [image, setImage] = useState(null);
const [mimeType,setMimeType] = useState(null);
const [loading, setLoading] = useState(false);
const [name, setName] = useState('');
const [sortname, setSortname] = useState('');
const [phonecode, setPhonecode] = useState('');
const [role, setRole] = useState(null);



useEffect(()=>{
    checkProtection();
    fetchRoleData();

},[]);

useEffect(()=>{
 (async ()=> {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !== 'granted'){
        Alert.alert('Permission to access media library denied');
    }
 })();
},[]);

const fetchRoleData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/roles/api/id/${JSON.parse(user).role_id}`);
      setRole(response.data); 
    
      // Assuming your API returns the existing Country data 
    } catch (error) {
      console.error("Error fetching roles", error);
      // Handle error
    }
  };

const pickImage = async () => {
    try {
     const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, 
        aspect: [4,3],
        quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setMimeType(result.assets[0].type);
      }

} catch (error) {
    console.error('Error picking image',error);
}
};

const handleUpload = async () => {
 if(!image){
    Alert.alert('Please pick an image first');
    return;
 }
 if(!name){
 Alert.alert('Please name must not be empty');
 return;
 }
 if(!sortname){
  Alert.alert('Please sort name must not be empty');
 return;
 }
  if(!phonecode){
  Alert.alert('Please phonecode must not be empty');
 return;
 }
 
  setLoading(true);

 const formData = new FormData();
 
 const localUri = image;
 const filename = localUri.split('/').pop();
 formData.append('file',{ 
    uri: localUri,
    type: "image/*",
    name: filename, 
});
formData.append('name',name);
formData.append('sortname',sortname);
formData.append('phonecode',phonecode);
 try {
    const response = await axios.post('http://192.168.236.194:3000/countries/api/upload',formData, {
     headers: {
        "Content-Type": 'multipart/form-data',
     },
    });
    console.log('Uploaded successfully', response.data);
    console.log('mime type:',mimeType);
    setLoading(false);
    navigation.navigate('Home');
    navigation.navigate('Country List');
 } catch (error) {
    console.error('Error uploading image',error);

 }
};

const checkProtection = async () => {
    try { 
       if(JSON.parse(token)) {
      const response = await axios.get('http://192.168.236.194:3000/api/protected',{
        headers: {Authorization: JSON.parse(token)},
      });
       // If successful, log the response
      console.log('Authentication Test response', JSON.stringify(response.data));
    }
    else{
    navigation.navigate('Login');
    }
    } catch (error) {
        console.error('Error testing authentication:', error);
    }

 };

return(
    <View style={styles.container}>
        {role && role.name === "Administrator" && 
        <>
        {image && <Image source={{uri: image}} style={{width: 200,height:200}} />}
        <Input placeholder="Name" value={name} onChangeText={(text) => setName(text)} />
        <Input placeholder="Sort Name" value={sortname} onChangeText={(text) => setSortname(text)} />
        <Input placeholder="Phone Code" value={phonecode} onChangeText={(text) => setPhonecode(text)} />
        <Button style={{marginBottom:10}} title="Pick Image" onPress={pickImage} />
        <Text></Text>
        <Button title="Upload Image" onPress={handleUpload} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </>
}
{role && role.name === "User" && 
  <Text>Please this sceen is only for Admin users</Text>
  }
    </View>
);
}