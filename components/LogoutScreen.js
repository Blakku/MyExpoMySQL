import { StyleSheet, View, Text, TouchableOpacity,Button } from "react-native";
import React,{useState,useEffect} from "react";
import {useAuth} from "./AuthProvider";


export default function LogoutScreen({navigation}){
    const {logout} = useAuth();

const handleLogout = async () => {
try {
    await logout(navigation);
    navigation.navigate('Home');
    
} catch (error) {
   console.error('Logout has been successful',error);
}

};

    return(
        <View style={styles.container}>
            <Text style={styles.displayText}>Are you sure you want to logout</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    displayText: {
        textAlign: 'center',
        marginBottom: 20,
    },

});