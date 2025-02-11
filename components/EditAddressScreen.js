import React, { useState, useEffect } from 'react'; 
import { View, Text, Image, ActivityIndicator } from 'react-native'; 
import { Button, Input } from 'react-native-elements';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { styles } from '../styles/styles';
import { Picker } from "@react-native-picker/picker";
import { useNavigation,useRoute } from '@react-navigation/native';


export default function EditAddressScreen () {
  const route  = useRoute();
  const navigation = useNavigation();
  const { addressId } = route.params; 
  const [state_id, setStateId] = useState(null);
  const [country_id,setCountryId] = useState(null);
  const [city_id,setCityId] = useState(null);
  const [address, setAddress] = useState(null);
  const [states,setStates] = useState([]);
  const [cities,setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [phonecode, setPhonecode] = useState(null);
  const [phone, setPhone] = useState(null);
  const [user_id,setUserId] = useState(null);



  useEffect(() => {
    checkProtection();
    fetchStates();
    fetchCountries();
    fetchCities();
    fetchAddressData();
    fetchRoleData();
  }, []);

  const fetchAddressData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/addresses/api/id/${addressId}`);
      setAddress(response.data); 
      setCountryId(response.data.country_id);
      setStateId(response.data.state_id);
      setCityId(response.data.city_id);
      setAddress(response.data.address);
      setPhonecode(response.data.phonecode);
      setPhone(response.data.phone);
      setUserId(response.data.user_id);
      // Assuming your API returns the existing Address data 
    } catch (error) {
      console.error("Error fetching addresses", error);
      // Handle error
    }
  };

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


const fetchRoleData = async () => {
  try {
    const response = await axios.get(`http://192.168.236.194:3000/roles/api/id/${JSON.parse(user).role_id}`);
    setRole(response.data); 
  
    // Assuming your API returns the existing Address data 
  } catch (error) {
    console.error("Error fetching roles", error);
    // Handle error
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

    // show loading
    setLoading(true);
 

    try {
      await axios.put(`http://192.168.236.194:3000/addresses/api/update/${addressId}`,{
        user_id:parseInt(user_id),
        country_id:parseInt(country_id,10),
        state_id:parseInt(state_id,10),
        city_id: parseInt(city_id,10),
        address,
        phonecode:parseInt(phonecode,10),
        phone,
      });
       // hide loader
       setLoading(false);
      // Address updated successfully, no need to explicitly update address
      navigation.navigate('Home'); 
      navigation.navigate('Address List');
      
    } catch (error) {
      console.error("Error updating Address", error);
      // Handle error
    }
  };

  const checkProtection = async () => {
    try {
      if (JSON.parse(token)) {
        const response = await axios.get('http://192.168.236.194:3000/api/protected', {
          headers: { Authorization: JSON.parse(token) },
        });
        // If successful, log the response
        console.log('Authentication Test response', JSON.stringify(response.data));
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error testing authentication:', error);
    }
  };

  return (
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
    <Picker.Item 
    key={index}
    label={item.name}
    value = {item.id}
    />
  
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
<Input placeholder="Phonecode" value={phonecode && phonecode.toString()} onChangeText={(text)=>setPhonecode(text)} />
<Input placeholder="Phone" value={phone && phone.toString()} onChangeText={(text)=>setPhone(text)} />


    <Button title="Submit" onPress={handleSubmit} />
    {loading && <ActivityIndicator size="large" color="#0000ff" />}

</View>
  );
};

