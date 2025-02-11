import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"; 
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "./AuthProvider";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input,Button } from "react-native-elements";

export default function DashboardScreen() {
 const navigation = useNavigation();
 const { user,token,logout } = useAuth();
 const [username,setUsername] = useState(null);
 const [userId, setUserId] = useState(null)
 const [fullName,setFullName] = useState(null);
 const [role,setRole] = useState(null);



useEffect(()=>{
fetchRoleData();
checkProtection();

},[]);





 

 const retrieveUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userData); 
    const extractUsername = parsedData.userResult.username;
    setUsername(extractUsername);
    const extractUserId = parsedData.userResult.id;
    setUserId(extractUserId);
    const extractFullName = parsedData.userResult.full_name;
    setFullName(extractFullName);
 }

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
    
 const checkProtection = async () => {
    try { 
       if(JSON.parse(token)) {
      const response = await axios.get('http://192.168.236.194:3000/api/protected',{
        headers: {Authorization: JSON.parse(token)},
      });
       // If successful, log the response
      console.log('Authentication Test response', JSON.stringify(response.data));
     await retrieveUserData();
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
      {token ?
      (<View style={styles.container}>
      
        <Text>{JSON.parse(user).full_name}</Text>                                                                                                             
        <Text>{JSON.parse(user).username}</Text>
        <Text>{role && role.name}</Text>
      <TouchableOpacity>
         <Text style={styles.textButton}>Register List</Text>
        </TouchableOpacity>
        <TouchableOpacity>
         <Text style={styles.textButton} onPress={() => navigation.navigate('Picture List')}>Picture List</Text>
        </TouchableOpacity>
        <TouchableOpacity>
         <Text style={styles.textButton}>Role List</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Address List")}>
         <Text style={styles.textButton}>Address List</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Country List")}>
         <Text style={styles.textButton}>Country List</Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('State List')}>
    <Text style={styles.textButton}>State List</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('City List')}>
    <Text style={styles.textButton}>City List</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Counter')}>
    <Text style={styles.textButton}>Counter</Text>
    </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Push Notifications')}>
    <Text style={styles.textButton}>Push Notification</Text>
    </TouchableOpacity>
     <TouchableOpacity onPress={() => navigation.navigate('Animation')}>
     <Text style={styles.textButton}>Animation</Text>
     </TouchableOpacity>
   <TouchableOpacity onPress={() => navigation.navigate('Location')}>
   <Text style={styles.textButton}>Location</Text>
   </TouchableOpacity>
   <TouchableOpacity onPress={() => navigation.navigate('Background Task')}>
   <Text style={styles.textButton}>Background Task</Text>
   </TouchableOpacity>
   <TouchableOpacity onPress={() => navigation.navigate('Parallax')}>
   <Text style={styles.textButton}>Parallax</Text>
   </TouchableOpacity>
   <TouchableOpacity onPress={() => navigation.navigate('Animated Frame')}>
   <Text style={styles.textButton}>Animated Frame</Text>
   </TouchableOpacity>
   <TouchableOpacity onPress={() => navigation.navigate('Web View')}>
   <Text style={styles.textButton}>Web View</Text>
   </TouchableOpacity>
   <TouchableOpacity onPress={() => navigation.navigate('Orientation')}>
   <Text style={styles.textButton}>Orientation</Text>
   </TouchableOpacity>   
   <TouchableOpacity onPress={() => navigation.navigate('Image Background')}>
   <Text style={styles.textButton}>Image Background</Text>
   </TouchableOpacity>    
   <TouchableOpacity onPress={() => navigation.navigate('Svg')}>
   <Text style={styles.textButton}>Svg</Text>
   </TouchableOpacity>  
  <TouchableOpacity onPress={() => navigation.navigate('Deep Link')}>
   <Text style={styles.textButton}>Deep Link</Text>
   </TouchableOpacity>    
  <TouchableOpacity onPress={() => navigation.navigate('Pan Responder')}>
  <Text style={styles.textButton}>Pan Responder</Text>
  </TouchableOpacity>    
  <TouchableOpacity onPress={()=> navigation.navigate('Pixel Ratio Image')} >
    <Text style={styles.textButton}>Pixel Ratio Image</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=> navigation.navigate('Parallax Animated Scroll View')}>
     <Text  style={styles.textButton}>Parallax Animated Scroll View</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Logout')}>
    <Text style={styles.textButton}>Logout</Text>
</TouchableOpacity>   
       </View> ) 
     : 
    ""
    }        
</ScrollView>
);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    textButton:{
     backgroundColor: '#000',
     padding: 10,
     color: '#fff',
     marginBottom: 10,
     textAlign: 'center',
    },
})