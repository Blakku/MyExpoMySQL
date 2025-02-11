import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Alert, Button  } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {useAuth} from "./AuthProvider";
import axios from "axios";
  
export default function CityListScreen() {
    const {login,token,user} = useAuth();
    const navigation = useNavigation();
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [role,setRole] = useState(null);

    useEffect(()=>{
        checkProtection();
        fetchCities();
        fetchStates();
        fetchRoleData();

    },[]);

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

    const handleEdit = async (cityId) => {
      try {
       navigation.navigate('Edit City', {cityId});
      } catch (error) {
        console.error('Error editing City',error);
      }

    };

    const handleDelete = async (cityId) => {
      try {
        Alert.alert(
          "Delete city", 
          "Are you sure you want to delete this city?",
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                await axios.delete(`http://192.168.236.194:3000/cities/api/delete/${cityId}`);
                fetchCities();
              }
            }
          ],
          {cancelable: false}
          );
      } catch (error) {
        console.error('Error Deleting cities',error);
        
      }
    }

    const renderCityItem = ({item}) => {
      return(
      <View style={styles.cityItem}>
        <Text>({item.name}) ({
             states.map((state)=>(
                item.state_id === state.id ?
                state.name
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
    <Button style={{marginBottom:10}} title="Add City" onPress={()=> navigation.navigate('Add City')} />
   {
    cities.length === 0 ?
    (<Text>No cities</Text>)
    :
    <FlatList 
    data={cities}
    keyExtractor={(item)=> item.id.toString()}
    renderItem={renderCityItem}
    
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
    cityItem: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    cityImage: {
      width: 100,
      height: 50,
      resizeMode: 'cover',
      marginBottom: 8,
    },
  });
