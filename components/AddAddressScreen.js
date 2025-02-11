import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {useAuth} from "./AuthProvider";
import {styles} from "../styles/styles";
import { Button,Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";




export default function AddAddressScreen({navigation}) {
const {token,user} = useAuth();
const [loading, setLoading] = useState(false);
const [user_id, setUserId] = useState(null);
const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);
const [country_id,setCountryId] = useState(null);
const [state_id,setStateId] = useState(null);
const [city_id,setCityId] = useState(null);
const [address, setAddress] = useState('');
const [phonecode, setPhonecode] = useState('');
const [phone, setPhone] = useState('');



useEffect(()=>{
    checkProtection();
    fetchCities();
    fetchStates();
    fetchCountries();

},[]);


const fetchStates = async () => {
    try {
        const response = await axios.get('http://192.168.236.194:3000/states/api/read');
        const stateData = response.data;
        console.log(stateData);
        setStates(stateData);
    } catch (error) {
        console.error('Error displaying states',error);
    }

};

const fetchCities = async () => {
  try {
      const response = await axios.get('http://192.168.236.194:3000/cities/api/read');
      const cityData = response.data;
      console.log(cityData);
      setCities(cityData);
  } catch (error) {
      console.error('Error displaying cities',error);
  }

};

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

const handleSubmit = async () => {

 if(!country_id){
 Alert.alert('Please country must not be empty');
 return;
 }
 if(!state_id){
  Alert.alert('Please state must not be empty');
 return;
 }
 if(!city_id){
  Alert.alert('Please city must not be empty');
 return;
 }  

 if(!address){
  Alert.alert('Please  address must not be empty');
 return;
 }
 if(!phonecode){
  Alert.alert('Please phone code must not be empty');
 return;
 }
 if(!phone){
  Alert.alert('Please phone must not be empty');
 return;
 }
 
  setLoading(true);


 try {
    const response = await axios.post('http://192.168.236.194:3000/addresses/api/create',{
        user_id:parseInt(JSON.parse(user).id,10),
        country_id:parseInt(country_id,10),
        state_id:parseInt(state_id,10),
        city_id: parseInt(city_id,10),
        address,
        phonecode:parseInt(phonecode,10),
        phone,
    });
    console.log('Address created successfully', response.data);
    setLoading(false);
    navigation.navigate('Home');
    navigation.navigate('Address List');
 } catch (error) {
    console.error('Error creating new address.',error);

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
    <ScrollView>
    <View style={styles.container}>
      
        <Picker 
     style = {styles.picker}
     selectedValue={country_id}
     onValueChange = {(itemValue)=>setCountryId(itemValue)} 
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

<Picker 
style = {styles.picker}
selectedValue={state_id}
onValueChange = {(itemValue)=>setStateId(itemValue)} 
>
<Picker.Item label="" value="" />
{states.map((item,index)=>(
  country_id === item.country_id ?
   <Picker.Item 
   key={index}
   label={item.name}
   value = {item.id}
   />
   :
   null
 
))}

</Picker> 

<Picker 
style = {styles.picker}
selectedValue={city_id}
onValueChange = {(itemValue)=>setCityId(itemValue)} 
>
<Picker.Item label="" value="" />
{cities.map((item,index)=>(
  state_id === item.state_id ?
   <Picker.Item 
   key={index}
   label={item.name}
   value = {item.id}
   />
   :
   null
 
))}

</Picker> 
<Input placeholder="Address" value={address} onChangeText={(text)=>setAddress(text)} />
<Input placeholder="Phonecode" value={phonecode} onChangeText={(text)=>setPhonecode(text)} />
<Input placeholder="Phone" value={phone} onChangeText={(text)=>setPhone(text)} />


        <Button title="Submit" onPress={handleSubmit} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
 

    </View>
    </ScrollView>
);
}