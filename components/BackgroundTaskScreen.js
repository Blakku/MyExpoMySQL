import React,{useState,useEffect} from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from '../styles/styles';
import * as TaskManager from 'expo-task-manager';

const TASK_NAME = 'exampleTask';
TaskManager.defineTask(TASK_NAME, 
    ({data,error})=> {
        if(error){
  console.error('Error is background Task',error);
  return;

        }
//handle background task data
console.log('Background Task data:',data);
    });
export default function BackgroundTaskScreen(){

useEffect(()=>{
 fetchTaskManager();
},[]);

const fetchTaskManager = async () => {
 TaskManager.isTaskDefined(TASK_NAME)
 .then(defined => {
    if(!defined) {
        TaskManager.defineTask(TASK_NAME, ({data, error})=>{
            if(error){
                console.error('Error in background task', error);
                return;
            }
            //handle background task data
 console.log('Background Task data',data);
        });
    }
 });
 // Start background Task
 TaskManager.startTaskAsync(TASK_NAME, { interval: 60000});// runs every 60 seconds
 // stop the background task when the component unmounts
 return () => {
    TaskManager.unregisterAllTasksAsync();
 };
};
    return(
        <View style={styles.container}>
         <Text>Background Task is running...</Text>
        </View>
    )

}