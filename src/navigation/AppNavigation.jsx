import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import EditTask from '../screens/EditTask';
import TaskDetails from '../screens/TaskDetails';
import ImagePreview from '../screens/ImagePreview';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTab" component={BottomNavigation} />
      <Stack.Screen name="Edit Task" component={EditTask} />
      <Stack.Screen name="Task Details" component={TaskDetails} />
      <Stack.Screen name="ImagePreview" component={ImagePreview} />
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
