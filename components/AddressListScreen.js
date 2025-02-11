import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Alert, Button  } from "react-native";
import React,{ useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {useAuth} from "./AuthProvider";
import axios from "axios";
  
export default function AddressListScreen() {
    const {login,token,user} = useAuth();
    const navigation = useNavigation();
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [role,setRole] = useState(null);

    useEffect(()=>{
        checkProtection();
        fetchCities();
        fetchStates();
        fetchCountries();
        fetchAddresses();
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

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://192.168.236.194:3000/addresses/api/read');
            const addressData = response.data;
            console.log(addressData);
            setAddresses(addressData);
        } catch (error) {
            console.error('Error displaying addresses',error);
        }
 
    };


    const handleEdit = async (addressId) => {
      try {
       navigation.navigate('Edit Address', {addressId});
      } catch (error) {
        console.error('Error editing Address',error);
      }

    };

    const handleDelete = async (addressId) => {
      try {
        Alert.alert(
          "Delete address", 
          "Are you sure you want to delete this address?",
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                await axios.delete(`http://192.168.236.194:3000/addresses/api/delete/${addressId}`);
                fetchAddresses();
              }
            }
          ],
          {cancelable: false}
          );
      } catch (error) {
        console.error('Error Deleting addresses',error);
        
      }
    }

    const renderAddressItem = ({item}) => {
      return(
        <View>
        { item.user_id === JSON.parse(user).id ?
          <>
          <View style={styles.addressItem}>     

       <Text>{item.address},</Text>
       <Text>{
        cities.map((city)=>(
         item.city_id === city.id ?
         city.name
         :
         ""
        ))
       },</Text>
         <Text>{
             states.map((state)=>(
                item.state_id === state.id ?
                state.name
                :
                ""
               ))
       },</Text>
        <Text>{
          countries.map((country)=>(
            item.country_id === country.id ?
            country.name
            :
            ""
          ))
          }
          .</Text>
       <Text>(+{item.phonecode}{item.phone})</Text>
       <Text style={{marginBottom:10}}> <Button  title="Edit" onPress={() => handleEdit(item.id)} />  </Text>     
        <Text style={{marginBottom:10}}><Button  title="Delete" onPress={() => handleDelete(item.id)} /></Text>
        
        </View>
        </>
        :
      ""
      }
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
 
    <Button style={{marginBottom:10}} title="Add Address" onPress={()=> navigation.navigate('Add Address')} />
   {
    addresses.length === 0 ?
    (<Text>No addresses</Text>)
    :
    <FlatList 
    data={addresses}
    keyExtractor={(item)=> item.id.toString()}
    renderItem={renderAddressItem}
    
    />
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
    addressItem: {
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
