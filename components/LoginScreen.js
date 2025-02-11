import { StyleSheet,View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React,{ useState,useContext } from "react";
import { Input,Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuth } from './AuthProvider';


export default function LoginScreen({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {login} = useAuth();



    const handleLogin = async () => {
        try {
            await login(username,password,navigation);
        } catch (error) {
          console.error('Login error',error);
          Alert.alert('Login Failed, invalid login details.');
        }
    }



    return(
        <View style={styles.container}>
            <Input placeholder="Username" onChangeText={setUsername} value={username} />
            <Input placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    }
})