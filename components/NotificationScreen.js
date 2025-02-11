import React,{useState,useEffect,useRef} from 'react'
import { StyleSheet,View, Text, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { styles } from '../styles/styles';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export default function NotificationScreen() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(()=>{
    registerForPushNotificationAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener
    (notification=>{
        setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener
    (response => {
        console.log(response);
    });
    return () => {
     Notifications.removeNotificationSubscription(notificationListener.current);
     Notifications.removeNotificationSubscription(responseListener.current);
    };
    },[]);

    const schedulePushNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
             title: "You have got mail.",
             body: "Here is the Notification Body",
             data: {
                data: "goes here"
             },
             },
             trigger: {seconds: 2},
            
        });
        }
    
        const registerForPushNotificationAsync = async () => {
            let token;
            if(Platform.OS === 'android'){
                await Notifications.setNotificationChannelAsync('default',{
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0,250,250,250],
                    lightColor: '#FF231F7C',
                });
            }
           if(Device.isDevice){
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if(existingStatus !== 'granted'){
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if(finalStatus !== 'granted'){
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync({projectId: 'your-peoject-id'})).data;
            console.log(token);
           }
           else {
            alert('Must use physical device for push notification.');
           }
        }

    return(
    <View style={{flex:1, alignItems: 'center', justifyContent: 'space-around',}}>
     <Text>Expo Push Notifications: {expoPushToken}</Text>
     <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text>Title : {notification && notification.request.content.title}</Text>
      <Text>Body : {notification && notification.request.content.body}</Text>
      <Text>Data : {notification && JSON.stringify(notification.request.content.data)}</Text>
     </View>
     <Button title="Press to schedule a notification" onPress={async () => { await schedulePushNotification();}} />
    </View>
    );

    
}

