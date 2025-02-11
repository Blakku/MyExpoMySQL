import { StyleSheet, View, Text, Button, Image, Alert, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { CheckBox } from 'react-native-elements';
import { useAuth } from './AuthProvider';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

export default function PictureListScreen() {
  const [pictures, setPictures] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const { login, token, user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    checkProtection();
    fetchPictures();
  }, []);

  const fetchPictures = async (pictureApiUrl = 'http://192.168.236.194:3000/pictures/api/read') => {
    try {
      const response = await axios.get(pictureApiUrl);
      setPictures(response.data);
    } catch (error) {
      console.error('Error displaying pictures', error);
    }
  };

  const handleEdit = (pictureId) => {
    try {
      navigation.navigate('Edit Picture', { pictureId });
    } catch (error) {
      console.error('Error editing Picture', error);
    }
  };

  const handleDelete = (pictureId) => {
    Alert.alert(
      "Delete Picture",
      "Are you sure you want to delete this picture?",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.236.194:3000/pictures/api/delete/${pictureId}`);
              fetchPictures();
            } catch (error) {
              console.error('Error Deleting Picture', error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const handleCheck = (itemId) => {
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId] || false,
    }));
  };

  const handleCheckAll = () => {
    setSelectAll(prevSelectAll => {
      const newCheckItems = {};
      if (!prevSelectAll) {
        pictures.forEach((item) => {
          newCheckItems[item.id] = true;
        });
      }
      return { selectAll: !prevSelectAll, checkedItems: newCheckItems };
    });
  };

  const handleDeleteSelected = async () => {
    const pictureIdsToDelete = Object.keys(checkedItems).filter((id) => checkedItems[id]);

    if (pictureIdsToDelete.length === 0) {
      Alert.alert("Delete Pictures", "No pictures selected for deletion.");
      return;
    }

    try {
      await axios.post('http://192.168.236.194:3000/pictures/api/delete-multiple', { pictureIds: pictureIdsToDelete });
      fetchPictures();
    } catch (error) {
      console.error('Error Deleting Pictures', error);
    }
  };

  const checkProtection = async (protectedApiUrl = 'http://192.168.236.194:3000/api/protected') => {
    try {
      const response = await axios.get(protectedApiUrl, {
        headers: { Authorization: JSON.parse(token) },
      });
      console.log('Authentication Test response', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error testing authentication:', error);
      navigation.navigate('Login');
    }
  };

  const renderPictureItem = ({ item }) => {
    return (
      <View style={styles.pictureItem}>
        <CheckBox title={`check me ${item.id}`} checked={checkedItems[item.id] || false} onPress={() => handleCheck(item.id)} />
        <Image source={{ uri: item.url }} style={styles.pictureImage} />
        <Button title="Edit" onPress={() => handleEdit(item.id)} />
        <Text></Text>
        <Button title="Delete" onPress={() => handleDelete(item.id)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Add Picture" onPress={() => navigation.navigate('Add Picture')} />
      <CheckBox title="Select All" checked={selectAll} onPress={handleCheckAll} />
      {pictures.length === 0 ? (
        <Text>No Pictures</Text>
      ) : (
        <>
          <Button title="Delete Selected" onPress={handleDeleteSelected} />
          <FlatList
            data={pictures}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPictureItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pictureItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pictureImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 8,
  },
});
