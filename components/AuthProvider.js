// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastScreen,setLastScreen] = useState(null);



  


  const login = async (username, password, navigation) => {
    try {
      // Perform login validation by making a request to the server
      const response = await axios.post('http://192.168.236.194:3000/api/login', {
        username,
        password,
      });
       
      const { success, userResult, token } = response.data;

      if (success) {
        // Save user data and token in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify({ userResult, token }));
       
        // Set user state
        setUser(JSON.stringify(userResult));
        setToken(JSON.stringify(token));


        //use your navigation to navigate to your desired screen
        navigation.navigate('Dashboard');

        Alert.alert('Login was successful');
       

      } else {
        // If the server indicates unsuccessful login, handle the error
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Validation Error','Please check your credentials.');
    }
  };


  const logout = async (navigation) => {
    try {
     // remove user data from AsyncStorage
     await AsyncStorage.removeItem('userData');
     setToken(null);
     // Additional logout logic, if needed    
      Alert.alert('Logout has been successful');
    } catch (error) {
       console.error('Logout Error',error);
       Alert.alert('Error during logout. Please try again.')
    }
   
  };

  return (
    <AuthContext.Provider value={{ user,token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
