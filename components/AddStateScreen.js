import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {useAuth} from "./AuthProvider";
import {styles} from "../styles/styles";
import { Button,Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";




export default function AddStateScreen() {
const navigation = useNavigation();
const {token,user} = useAuth();
const [loading, setLoading] = useState(false);
const [name, setName] = useState('');
const [country_id, setCountry_id] = useState('');
const [countries, setCountries] = useState([]);
const [role,setRole] = useState(null);



useEffect(()=>{
    checkProtection();
    fetchCountries();
    fetchRoleData();

},[]);


const fetchCountries = async () => {
    try {
        const response = await axios.get('http://192.168.236.194:3000/countries/api/read');
        const countryData = response.data;
        console.log(countryData);
        setCountries(countryData);
    } catch (error) {
        console.error('Error displaying countries',error);
    }

};

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
const handleSubmit = async () => {

 if(!name){
 Alert.alert('Please name must not be empty');
 return;
 }
 if(!country_id){
  Alert.alert('Please select state must not be empty');
 return;
 }
  
 
  setLoading(true);


 try {
    const response = await axios.post('http://192.168.236.194:3000/states/api/create',{
        name,
        country_id:parseInt(country_id,10),
    });
    console.log('State created successfully', response.data);
    setLoading(false);
    navigation.navigate('Home');
    navigation.navigate('State List');
 } catch (error) {
    console.error('Error creating new state.',error);

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
        <Input placeholder="Name" value={name} onChangeText={(text) => setName(text)} />
        <Picker 
     style = {styles.picker}
     selectedValue={country_id}
     onValueChange = {(itemValue)=>setCountry_id(itemValue)} 
     >
     <Picker.Item label="" value="" />
     {countries.map((item,index)=>(
        <Picker.Item 
        key={index}
        label={item.name}
        value = {item.id}
        />
      
     ))}

     </Picker>
        <Button title="Submit" onPress={handleSubmit} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </>
 }
 {role && role.name === "User" && 
  <Text>Please this sceen is only for Admin users</Text>
  }
    </View>
);
}