import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash';
import Walkthrough from '../screens/Walkthrough';
import LoginInitialScreen from '../screens/loginInitialScreen';
import LoginV2 from '../screens/LoginV2';
import SignupV2 from '../screens/SignupV2';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import English from '../screens/Home/Subject/English';

import HomePage from '../screens/Home/HomePage';
import Profile from '../screens/Home/Profile';
import Classes from '../screens/Home/Classes';
import TabNavigator from './TabNavigator';
import ChapterOne from '../screens/Home/Subject/Chapter/ChapterOne';
import QuizPage from '../screens/Home/Subject/Chapter/Quiz';
import Result from '../screens/Home/Subject/Chapter/Result';
import TeacherLogin from '../screens/Teacher/Auth/TeacherLogin';
import TeacherSignup from '../screens/Teacher/Auth/TeacherSignup';
import TeacherHome from '../screens/Teacher/Home/TeacherHome';
import TeacherTabNavigator from './TeacherTabNavigator';
import ForgetPasswordStudent from '../screens/ForgetPasswordStudent';
import TeacherForgatPassword from '../screens/Teacher/Auth/TeacherForgatPassword';

import StudentPayment from '../screens/Home/Subject/Payment/StudentPayment';
import Plane from '../screens/Home/Subject/Payment/Plane';
import TeacherSubject from '../screens/Teacher/Home/TeacherSubject';
import TeacherChapter from '../screens/Teacher/Home/TeacherChapter';
import TeacherChapterContain from '../screens/Teacher/Home/TeacherChapterContain';
import TeacherVideoCallWaiting from '../screens/Teacher/Home/TeacherVideoCallWaiting';
import TeacherVideoCall from '../screens/Teacher/Home/TeacherVideoCall';
import VideoCallingWaiting from '../screens/VideoCallingWaiting';
import AcceptRejectVideoCall from '../screens/AcceptRejectVideoCall';
import VideoCalling from '../screens/VideoCalling';
import Terms from '../screens/Home/Terms';
import Privacy from '../screens/Home/Privacy';
import ContactUs from '../screens/Home/ContactUs';
import Cancellation from '../screens/Home/Cancellation';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Walkthrough"
          component={Walkthrough}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginInitialScreen"
          component={LoginInitialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginV2"
          component={LoginV2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupV2"
          component={SignupV2}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name='ForgetPasswordStudent'
          component={ForgetPasswordStudent}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='Terms'
          component={Terms}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='Privacy'
          component={Privacy}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='ContactUs'
          component={ContactUs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='Cancellation'
          component={Cancellation}
          options={{ headerShown: false }}
        />



        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="English"
          component={English}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='StudentPayment'
          component={StudentPayment}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Plane"
          component={Plane}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name="ChapterOne"
          component={ChapterOne}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{ headerShown: false }}
        />

        {/* Teacher */}

        <Stack.Screen
          name='TeacherLogin'
          component={TeacherLogin}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='TeacherSignup'
          component={TeacherSignup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='TeacherForgatPassword'
          component={TeacherForgatPassword}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='TeacherSubject'
          component={TeacherSubject}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherChapter"
          component={TeacherChapter}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='TeacherChapterContain'
          component={TeacherChapterContain}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='TeacherVideoCallWaiting'
          component={TeacherVideoCallWaiting}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherVideoCall"
          component={TeacherVideoCall}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherTabNavigator"
          component={TeacherTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="teacherVideoCallWaiting"
          component={VideoCallingWaiting}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="acceptRejectVideoCall"
          component={AcceptRejectVideoCall}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="videoCalling"
          component={VideoCalling}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
