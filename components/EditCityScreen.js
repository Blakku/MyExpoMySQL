import React, { useState, useEffect } from 'react'; 
import { View, Text, Image, ActivityIndicator } from 'react-native'; 
import { Button, Input } from 'react-native-elements';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { styles } from '../styles/styles';
import { Picker } from "@react-native-picker/picker";


export default function EditCityScreen ({ route, navigation }) {
  const { cityId } = route.params; 
  const [name, setName] = useState(null);
  const [state_id, setStateId] = useState(null);
  const [city, setCity] = useState(null);
  const [states,setStates] = useState([]);
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);



  useEffect(() => {
    checkProtection();
    fetchStates();
    fetchCityData();
    fetchRoleData();
  }, []);

  const fetchCityData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/cities/api/id/${cityId}`);
      setCity(response.data); 
      setName(response.data.name);
      setStateId(response.data.state_id);
      // Assuming your API returns the existing City data 
    } catch (error) {
      console.error("Error fetching cities", error);
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

const fetchRoleData = async () => {
  try {
    const response = await axios.get(`http://192.168.236.194:3000/roles/api/id/${JSON.parse(user).role_id}`);
    setRole(response.data); 
  
    // Assuming your API returns the existing City data 
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
    
      if (!state_id) {
        Alert.alert("Validation Error",'Please select city before updating.');
        return;
      }

    // show loading
    setLoading(true);
 

    try {
      await axios.put(`http://192.168.236.194:3000/cities/api/update/${cityId}`,{
        name,
        state_id:parseInt(state_id,10),
      });
       // hide loader
       setLoading(false);
      // City updated successfully, no need to explicitly update city
      navigation.navigate('Home'); 
      navigation.navigate('City List');
      
    } catch (error) {
      console.error("Error updating City", error);
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
 selectedValue={state_id}
 onValueChange = {(itemValue)=>setCityId(itemValue)} 
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

