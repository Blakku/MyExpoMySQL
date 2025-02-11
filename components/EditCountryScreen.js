import React, { useState, useEffect } from 'react'; 
import { View, Text, Image, ActivityIndicator } from 'react-native'; 
import { Button, Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { styles } from '../styles/styles';

export default function EditCountryScreen ({ route, navigation }) {
  const { countryId } = route.params; 
  const [image, setImage] = useState(null); 
  const [name, setName] = useState(null);
  const [sortname, setSortname] = useState(null);
  const [phonecode,setPhonecode] = useState(null);
  const [country, setCountry] = useState(null);
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role,setRole] = useState(null);

  useEffect(() => {
    fetchCountryData();
  }, [countryId]);

  useEffect(() => {
    checkProtection();
    fetchRoleData();
  }, []);


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



  const fetchCountryData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/countries/api/id/${countryId}`);
      setCountry(response.data); 
      setSortname(response.data.sortname);
      setName(response.data.name);
      setPhonecode(response.data.phonecode);
      // Assuming your API returns the existing Country data 
    } catch (error) {
      console.error("Error fetching countries" + countryId, error);
      // Handle error
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        // Immediately update the Country state with the newly selected image
        setCountry({ ...country, flag:  result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image", error);
      // Handle error
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      console.warn('Please select a new Country before updating.');
      return;
    }
     if (!sortname) {
      Alert.alert("Validation Error",'Please focus on Sort Name before updating.');
      return;
    }
    if (!name) {
        Alert.alert("Validation Error",'Please focus on Name before updating.');
        return;
      }
      if (!phonecode) {
        Alert.alert("Validation Error",'Please focus on Phone Code before updating.');
        return;
      }

    // show loading
    setLoading(true);
    const formData = new FormData();
    const localUri = image;
    const filename = image.split('/').pop();
    formData.append('file', {
      uri: localUri,
      type: 'image/*',
      name: filename,
    });
    formData.append('sortname', sortname);
    formData.append('name', name);
    formData.append('phonecode',phonecode);

    try {
      await axios.put(`http://192.168.236.194:3000/countries/api/update/${countryId}`, formData, {
        headers: {
           "Content-Type": 'multipart/form-data',
        },
       });
       // hide loader
       setLoading(false);
      // Country updated successfully, no need to explicitly update state
      navigation.navigate('Home'); 
      navigation.navigate('Country List');
      
    } catch (error) {
      console.error("Error updating Country", error);
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
      {country && (
        <View>
          <View>
            <Text>Current Country Flag:</Text>
            {image ?
            <Image source={{ uri: country.flag }} style={{ width: 150, height: 50 }} />
           :
            <Image source={{ uri: `http://192.168.236.194:19001/uploads/${country.flag}`}} style={{ width: 150, height: 50 }} />
        }
          </View>
          <View style={{marginBottom:10}}>
            <Text>New Country Flag:</Text>
            <Button title="Pick an image from the gallery" onPress={pickImage} />
          </View>
          <Input placeholder='Sort Name' onChangeText={(text)=>setSortname(text)} value={sortname} />
          <Input placeholder='Name' onChangeText={(text)=>setName(text)} value={name} />
          <Input placeholder='Phonecode' onChangeText={(text)=>setPhonecode(text)} value={phonecode && phonecode.toString()}  />
          <View>

          <Button title="Update Country" onPress={handleSubmit} />
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        </View>
      )}
      </>
}
{role && role.name === "User" && 
  <Text>Please this sceen is only for Admin users</Text>
  }
    </View>
  );
};

