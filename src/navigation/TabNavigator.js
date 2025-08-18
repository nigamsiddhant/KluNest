import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomePage from '../screens/Home/HomePage';
import Classes from '../screens/Home/Classes';
import Profile from '../screens/Home/Profile';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../components/responsive';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BASE_URL, STUDENT_CALL_STATUS} from '../constant/StringAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import PaymentHistory from '../screens/Home/PaymentHistory';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  const requestPermissions = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const audioPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

    if (
      cameraPermission === RESULTS.GRANTED &&
      audioPermission === RESULTS.GRANTED
    ) {
      console.log('Camera and Audio permissions granted');
    } else {
      console.log('Camera or Audio permission denied');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      requestPermissions();

      const checkCall = async () => {
        try {
          const options = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const UserDataID = await AsyncStorage.getItem('UserDataID');

          const formData = new FormData();

          formData.append('student_id', UserDataID);

          console.log('getStudent Status', formData);

          const response = await axios.post(
            `${BASE_URL}${STUDENT_CALL_STATUS}`,
            formData,
            options,
          );

          if (
            response?.data?.status === 'success' &&
            response?.data?.data?.status === 'pending'
          ) {
            const result = response.data.data;
            navigation.navigate('acceptRejectVideoCall', {
              studentId: UserDataID,
              videoCallId: result.video_call_id,
              channelName: result.channel_name,
              channelToken: result.agora_token,
            });
          }
          console.log('got call for student', response?.data);
        } catch (e) {
          console.log('erro', e);
        }
      };

      let intervalId = null;
      if (isActive) {
        intervalId = setInterval(() => {
          checkCall();
        }, 5000);
      }

      return () => {
        isActive = false;
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, []),
  );

  return (
    <Tab.Navigator
      sceneContainerStyle={{flex: 1}}
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
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
        name="Classes"
        component={Classes}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
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
              Doubt Classes
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                name="payment"
                size={moderateScale(30)}
                color={focused ? '#7F3DFF' : '#C6C6C6'}
              />
            );
          },
          tabBarLabel: ({focused}) =>{
            return(
              <Text style={{color: focused ? '#7F3DFF' : '#C6C6C6', fontSize: 12}} >
               Payment
              </Text>
            )
          }
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              // Add return statement here
              <Image
                source={require('../images/ProfileIcon.png')}
                style={[
                  styles.tabIcon,
                  {tintColor: focused ? '#7F3DFF' : '#C6C6C6'},
                ]}
              />
            );
          },
          tabBarLabel: ({focused}) => {
            return (
              // Add return statement here
              <Text
                style={{color: focused ? '#7F3DFF' : '#C6C6C6', fontSize: 12}}>
                Profile
              </Text>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
const styles = StyleSheet.create({
  tabIcon: {
    width: horizontalScale(25),
    height: verticalScale(25),
    resizeMode: 'contain',
    marginTop: 5,
  },
});
