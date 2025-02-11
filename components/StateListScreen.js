import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Alert, Button } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {useAuth} from "./AuthProvider";
import axios from "axios";
  
export default function StateListScreen() {
    const {login,token,user} = useAuth();
    const navigation = useNavigation();
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [role,setRole] = useState(null);

    useEffect(()=>{
        checkProtection();
        fetchStates();
        fetchCountries();
        fetchRoleData();

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

    const handleEdit = async (stateId) => {
      try {
       navigation.navigate('Edit State', {stateId});
      } catch (error) {
        console.error('Error editing State',error);
      }

    };

    const handleDelete = async (stateId) => {
      try {
        Alert.alert(
          "Delete state", 
          "Are you sure you want to delete this state?",
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                await axios.delete(`http://192.168.236.194:3000/states/api/delete/${stateId}`);
                fetchStates();
              }
            }
          ],
          {cancelable: false}
          );
      } catch (error) {
        console.error('Error Deleting states',error);
        
      }
    }

    const renderStateItem = ({item}) => {
      return(
      <View style={styles.stateItem}>
        <Text>({item.name}) ({
             countries.map((country)=>(
                item.country_id === country.id ?
                country.name
                :
                ""
               ))
       })</Text>
       <Text style={{marginBottom:10}}> <Button  title="Edit" onPress={() => handleEdit(item.id)} />  </Text>     
        <Text style={{marginBottom:10}}><Button  title="Delete" onPress={() => handleDelete(item.id)} /></Text>
      </View>
      );
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
    <Button style={{marginBottom:10}} title="Add State" onPress={()=> navigation.navigate('Add State')} />
   {
    states.length === 0 ?
    (<Text>No states</Text>)
    :
    <FlatList 
    data={states}
    keyExtractor={(item)=> item.id.toString()}
    renderItem={renderStateItem}
    
    />
   }
   </>
   }
     {role && role.name === "User" && 
  <Text>Please this sceen is only for Admin users</Text>
}

  </View>
);



}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    stateItem: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    stateImage: {
      width: 100,
      height: 50,
      resizeMode: 'cover',
      marginBottom: 8,
    },
  });
