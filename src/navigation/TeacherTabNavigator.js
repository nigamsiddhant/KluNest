import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TeacherHome from '../screens/Teacher/Home/TeacherHome';
import { horizontalScale, verticalScale } from '../components/responsive';
import TeacherProfile from '../screens/Teacher/Home/TeacherProfile';
import TeacherMeeting from '../screens/Teacher/Home/TeacherMeeting';

const TeacherTabNavigator = () => {

   const Tab = createBottomTabNavigator();
  return (
   <Tab.Navigator sceneContainerStyle={{flex:1}}
   
   screenOptions={{
    tabBarHideOnKeyboard: true,
  }}
   >
  <Tab.Screen
  name='TeacherHome'
  component={TeacherHome}
  options={{
    headerShown: false,
      tabBarIcon: ({focused}) =>(
        <Image
        source={require('../images/HomeIcon.png')}
        style={[
            styles.tabIcon,
            {tintColor: focused ? '#7F3DFF' : '#C6C6C6'},
          ]}
        />
      ),
      tabBarLabel: ({focused}) => (
        <Text
          style={{color: focused ? '#7F3DFF' : '#C6C6C6', fontSize: 12}}>
          Home
        </Text>
      ),
  }}
  />
   <Tab.Screen
   name="TeacherMeeting"
   component={TeacherMeeting}

   options={{
    headerShown:false,
    tabBarIcon:({focused}) =>(
      <Image
      source={require('../images/ClassesIcon.png')}
      style={[
        styles.tabIcon,
        {tintColor: focused ? '#7F3DFF' : '#C6C6C6'},
      ]}
      />
    ),
    tabBarLabel: ({focused}) => (
      <Text
        style={{color: focused ? '#7F3DFF' : '#C6C6C6', fontSize: 12}}>
        Meeting
      </Text>
    ),
   }}
   />


<Tab.Screen
name='TeacherProfile'
component={TeacherProfile}
options={{
    headerShown: false,
    tabBarIcon: ({focused}) =>(
        <Image
        source={require('../images/ProfileIcon.png')}
        style={[
            styles.tabIcon,
            {tintColor: focused ? '#7F3DFF' : '#C6C6C6'},
        ]}
        />
    ) ,
    tabBarLabel: ({focused}) => (
        <Text
          style={{color: focused ? '#7F3DFF' : '#C6C6C6', fontSize: 12}}>
          Profile
        </Text>
      ),
}}
/>



</Tab.Navigator>

    
  )
}

export default TeacherTabNavigator

const styles = StyleSheet.create({
    tabIcon: {
      width: horizontalScale(25),
      height: verticalScale(25),
      resizeMode: 'contain',
      marginTop: 5,
    },
  });