import React,{useState,useEffect} from 'react';
import { styles } from '../styles/styles';
import { View,Text } from 'react-native';
import { Button } from 'react-native-elements';


export default function CounterScreen(){

    const [count, setCount] = useState(0);

   
    return(
        <View style={styles.container}>
          <Text>count: {count}</Text>
          {count < 10 && 
          <Button title="Increment Button" onPress={()=> setCount(count + 1)} />
          }
          <Text></Text>
          {count > 0 &&
          <Button title="Decrement Button" onPress={()=> setCount(count - 1)} />
          }
        </View>

    );

}