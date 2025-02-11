import { StyleSheet,View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {useAuth} from "./AuthProvider";
 

export default function HomeScreen(){
    const navigation = useNavigation();
    const {user, login,token,logout} = useAuth();


return(
    <View style={styles.container}>
        <Text style={styles.headerText}>Expo Function Based Javacript React Native App</Text>
     {token ? 
       <>
       <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.button}>Dashboard</Text>
    </TouchableOpacity>    
   
    <TouchableOpacity onPress={() => navigation.navigate('Logout')}>
    <Text style={styles.button}>Logout</Text>
</TouchableOpacity>   


</>
     :
 <>    
<TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.button}>Register</Text>
    </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Text style={styles.button}>Login</Text>
  </TouchableOpacity>     
  </>

}
      
 
    </View>
);
}
const styles =  StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    button:{
       backgroundColor: '#000',
       color: '#fff',
       textAlign: 'center',
       padding: 5,
       fontSize: 20,
       marginBottom: 15,
    },
    headerText:{
     fontSize: 30,
     fontWeight: 'bold',
     textAlign: 'center',
     marginBottom: 20,
    },

});
