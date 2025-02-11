import React,{useEffect, useState} from "react";
import { View,Text, LayoutAnimation } from "react-native";
import { styles } from "../styles/styles";
import { Button } from "react-native-elements";


export default function AnimationScreen(){
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setExpanded(!expanded);
    };

    return(
        <View style={styles.container}>
           <Button title="Toggle Expansion" onPress={toggleExpansion}/>
           {expanded && <View
           style={{height: 100, backgroundColor: 'lightblue'}}
           />}
        </View>
    );
}