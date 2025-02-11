import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {useAuth} from "./AuthProvider";
import {styles} from "../styles/styles";
import { Button,Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";




export default function AddCityScreen() {
const navigation = useNavigation();
const {token,user} = useAuth();
const [loading, setLoading] = useState(false);
const [name, setName] = useState('');
const [state_id, setState_id] = useState('');
const [states, setStates] = useState([]);
const [role,setRole] = useState(null);



useEffect(()=>{
    checkProtection();
    fetchStates();
    fetchRoleData();

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

const fetchRoleData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/roles/api/id/${JSON.parse(user).role_id}`);
      setRole(response.data); 
    
      // Assuming your API returns the existing State data 
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
 if(!state_id){
  Alert.alert('Please select state must not be empty');
 return;
 }
  
 
  setLoading(true);


 try {
    const response = await axios.post('http://192.168.236.194:3000/cities/api/create',{
        name,
        state_id:parseInt(state_id,10),
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
     selectedValue={state_id}
     onValueChange = {(itemValue)=>setState_id(itemValue)} 
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
}