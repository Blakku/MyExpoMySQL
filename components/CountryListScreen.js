import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Alert, Button } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {useAuth} from "./AuthProvider";
import axios from "axios";
  
export default function CountryListScreen() {
    const {login,token,user} = useAuth();
    const navigation = useNavigation();
    const [countries, setCountries] = useState([]);
    const [role,setRole] = useState(null);

    useEffect(()=>{
      fetchRoleData();
        checkProtection();
        fetchCountries();

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

    const handleEdit = async (countryId) => {
      try {
       navigation.navigate('Edit Country', {countryId});
      } catch (error) {
        console.error('Error editing Country',error);
      }

    };

    const handleDelete = async (countryId) => {
      try {
        Alert.alert(
          "Delete country", 
          "Are you sure you want to delete this country?",
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                await axios.delete(`http://192.168.236.194:3000/countries/api/delete/${countryId}`);
                fetchCountries();
              }
            }
          ],
          {cancelable: false}
          );
      } catch (error) {
        console.error('Error Deleting countries',error);
        
      }
    }

    const renderCountryItem = ({item}) => {
      return(
      <View style={styles.countryItem}>
        <Image source={{uri:"http://192.168.236.194:19001/uploads/" + item.flag}} style={styles.countryImage}  />
        <Text>{item.flag}</Text>
        <Text>{item.name} ({item.sortname})({item.phonecode})</Text>
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
    {role && role.name == "Administrator" && 
    <>
    <Button style={{marginBottom:10}} title="Add Country" onPress={()=> navigation.navigate('Add Country')} />
   {
    countries.length === 0 ?
    (<Text>No countries</Text>)
    :
    <FlatList 
    data={countries}
    keyExtractor={(item)=> item.id.toString()}
    renderItem={renderCountryItem}
    
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
    countryItem: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    countryImage: {
      width: 100,
      height: 50,
      resizeMode: 'cover',
      marginBottom: 8,
    },
  });
