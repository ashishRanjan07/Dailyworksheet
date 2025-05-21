import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Create from '../screens/Create';
import TaskList from '../screens/TaskList';
import Colors from '../utils/Colors';
import { moderateScale, textScale } from '../utils/responsiveSize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.gray,
      }}>
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.labelText, { color }]}>Create</Text>
          ),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons name="add-task" size={moderateScale(24)} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Task List"
        component={TaskList}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.labelText, { color }]}>Task List</Text>
          ),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <MaterialIcons name="article" size={moderateScale(24)} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    borderWidth: 2,
    bottom: moderateScale(20),
    height: moderateScale(70),
    borderRadius: moderateScale(15),
    backgroundColor: Colors.primary,
    elevation: moderateScale(5),
    width: '95%',
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScale(50),
    width: moderateScale(50),
    marginTop: moderateScale(15),
  },
  labelText: {
    fontSize: textScale(12),
    fontWeight: '800',
    marginTop: moderateScale(10),
    textAlign: 'center',
    color: Colors.black,
  },
});
