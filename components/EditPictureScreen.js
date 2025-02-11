import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { styles } from '../styles/styles';

export default function EditPictureScreen ({ route, navigation }) {
  const { pictureId } = route.params;
  const [image, setImage] = useState(null);
  const [user_id, setUserId] = useState('');
  const [picture, setPicture] = useState(null);
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPictureData();
  }, [pictureId]);

  useEffect(() => {
    checkProtection();
  }, []);

  const fetchPictureData = async () => {
    try {
      const response = await axios.get(`http://192.168.236.194:3000/pictures/api/id/${pictureId}`);
      setUserId(response.data.user_id);
      setPicture(response.data); // Assuming your API returns the existing picture data
    } catch (error) {
      console.error("Error fetching pictures" + pictureId, error);
      // Handle error
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        // Immediately update the picture state with the newly selected image
        setPicture({ ...picture, url: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image", error);
      // Handle error
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      console.warn('Please select a new picture before updating.');
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
    formData.append('user_id', user_id); // Keep the existing user_id

    try {
      await axios.put(`http://192.168.236.194:3000/pictures/api/update/${pictureId}`, formData, {
        headers: {
           "Content-Type": 'multipart/form-data',
        },
       });
       // hide loader
       setLoading(false);
      // Picture updated successfully, no need to explicitly update state
      navigation.navigate('Home'); 
      navigation.navigate('Picture List');
      
    } catch (error) {
      console.error("Error updating picture", error);
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
      {picture && (
        <View>
          <View>
            <Text>Current Picture:</Text>
            <Image source={{ uri: picture.url }} style={{ width: 200, height: 200 }} />
            <Text>{image}</Text>
          </View>
          <View style={{marginBottom:10}}>
            <Text>New Picture:</Text>
            <Button title="Pick an image from the gallery" onPress={pickImage} />
          </View>
          <View>

          <Button title="Update Picture" onPress={handleSubmit} />
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        </View>
      )}
    </View>
  );
};

