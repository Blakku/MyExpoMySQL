import { StyleSheet,View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native"; 
import React,{ useState,useEffect } from "react";
import axios from "axios";
import { Button,Input, } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";





export default function RegistrationScreen({navigation}) {
    const [sources, setSources] = useState([]);
    const [roles, setRoles] = useState([]); 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [full_name, setFull_name] = useState("");
    const [role_id, setRoleId] = useState('');
    const [source_id, setSourceId] = useState('');



    useEffect(()=>{
      fetchRoles();
      fetchSources();
    },[]);

  


    const fetchRoles = async () => {
     const response = await axios.get('http://192.168.236.194:3000/roles/api/read');
     const rolesData = response.data;
     setRoles(rolesData);
    }
    const fetchSources = async () =>  {
      const response = await axios.get('http://192.168.236.194:3000/sources/api/read');
      const sourcesData = response.data;
      setSources(sourcesData);
    }

    const validateForm = async () => {
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !full_name.trim() || !role_id || !source_id) {
        Alert.alert('Please fill out all fields.');
        return false;
      }
  
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Please enter a valid email address.');
        return false;
      }

      if(password !== confirmPassword){
        Alert.alert("Passwords don't match.");
        return false;
      }
  
      try {
        const usernameResponse = await axios.get(`http://192.168.236.194:3000/check-username/${username}`);
  
        const emailResponse = await axios.get(`http://192.168.236.194:3000/check-email/${email}`);
  
        // Handle the response from the server for username
        if (usernameResponse.data.exists) {
          Alert.alert('Username already exists. Please choose a different one.');
          return false;
        }
  
        // Handle the response from the server for email
        if (emailResponse.data.exists) {
          Alert.alert('Email already exists. Please use a different one.');
          return false;
        }
  
        // All validations passed
        return true;
      } catch (error) {
        console.error('Error during validation:', error);
        Alert.alert('An error occurred during validation.');
        return false;
      }
    };

    const handleSubmit = async () => {
      const isValid = await validateForm();
      if (isValid) {
        // Perform additional actions upon successful form submission
        // For example, send the registration data to the server for processing
        await axios.post('http://192.168.236.194:3000/users/api/register', {
          username,
          password,
          email,
          full_name,
          source_id:parseInt(source_id,10),
          role_id:parseInt(role_id,10),
        });
        Alert.alert('Your registration has been successful');
        setUsername('');
        setPassword('');
        setconfirmPassword('');
        setFull_name('');
        setSourceId('');
        setRoleId('');
        navigation.navigate('Login');
      }
    };
  
    
    
   return(
    <ScrollView>

    <View style={styles.container}>
     <Input placeholder="Username" onChangeText={(text) => setUsername(text)}  value={username}  />
     <Input placeholder="Password" onChangeText={(text) => setPassword(text)} value={password} secureTextEntry />
     <Input placeholder="Confirm Password" onChangeText={(text) => setconfirmPassword(text)} value={confirmPassword} secureTextEntry />
     <Input placeholder="Email" onChangeText={(text) => setEmail(text)} value={email}  />
     <Input placeholder="Full Name" onChangeText={(text) => setFull_name(text)} value={full_name} />
     <Picker 
     style = {styles.picker}
     selectedValue={source_id}
     onValueChange = {(itemValue)=>setSourceId(itemValue)} 
     >
     <Picker.Item label="" value="" />
     {sources.map((item,index)=>(
        <Picker.Item 
        key={index}
        label={item.name}
        value = {item.id}
        />
      
     ))}

     </Picker>
      <Picker 
      selectedValue={role_id}
      onValueChange = {(itemValue)=>setRoleId(itemValue)}
      >
      <Picker.Item label="" value="" />
 
       {roles.map((item,index)=>(
         <Picker.Item 
         key = {index}
         label = {item.name}
         value = {item.id}
         />
      
       ))}
       </Picker>
    
       <Button onPress={handleSubmit} title="Submit"  />
    </View>
    </ScrollView>

   );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    textInput: {
        padding: 5,
        fontSize: 18,
    },
 

});