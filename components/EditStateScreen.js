import React, { useState, useEffect } from 'react'; 
import { View, Text, Image, ActivityIndicator } from 'react-native'; 
import { Button, Input } from 'react-native-elements';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { styles } from '../styles/styles';
import { Picker } from "@react-native-picker/picker";


export default function EditStateScreen ({ route, navigation }) {
  const { stateId } = route.params; 
  const [name, setName] = useState(null);
  const [country_id, setCountryId] = useState(null);
  const [state, setState] = useState(null);
  const [countries,setCountries] = useState([]);
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchStateData();
  }, [stateId]);

  useEffect(() => {
    checkProtection();
    fetchCountries();
    fetchRoleData();
  }, []);

  const fetchStateData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/states/api/id/${stateId}`);
      setState(response.data); 
      setName(response.data.name);
      setCountryId(response.data.country_id);
      // Assuming your API returns the existing State data 
    } catch (error) {
      console.error("Error fetching states" + stateId, error);
      // Handle error
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
  
    // Assuming your API returns the existing Country data 
  } catch (error) {
    console.error("Error fetching roles", error);
    // Handle error
  }
};

  const handleSubmit = async () => {

    if (!name) {
        Alert.alert("Validation Error",'Please focus on Name before updating.');
        return;
      }
    
      if (!country_id) {
        Alert.alert("Validation Error",'Please select country before updating.');
        return;
      }

    // show loading
    setLoading(true);
 

    try {
      await axios.put(`http://192.168.236.194:3000/states/api/update/${stateId}`,{
        name,
        country_id:parseInt(country_id,10),
      });
       // hide loader
       setLoading(false);
      // State updated successfully, no need to explicitly update state
      navigation.navigate('Home'); 
      navigation.navigate('State List');
      
    } catch (error) {
      console.error("Error updating State", error);
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
       {role && role.name === "Administrator" && 
        <>  
    <Input placeholder="Name" value={name} onChangeText={(text) => setName(text)} />
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
    <Button title="Submit" onPress={handleSubmit} />
    {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </>
 }
    {role && role.name === "User" && 
  <Text>Please this sceen is only for Admin users</Text>
  }
</View>
  );
};

