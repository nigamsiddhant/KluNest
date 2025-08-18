

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../utils/Colors';
import CustomeTextInput from '../components/CustomeTextInput';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BASE_URL, LOGIN_USER } from '../constant/StringAPI';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import for icons
import { ScrollView } from 'react-native-gesture-handler';






const Login = () => {
  const navigation = useNavigation();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkbox, setCheckbox] = useState(0)
  console.log(checkbox)



  const [MobileErrormessage, setMobileErrormessage] = useState('');
  const [PasswordErrormessage, setPasswordErrormessage] = useState('');
  const [CheckboxError, setCheckboxError] = useState('')

  const [loading, setLoding] = useState(false);
  // const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      // Reset all state values when this screen is focused
      setMobile('');
      setPassword('');
      setMobileErrormessage('');
      setPasswordErrormessage('');
      setShowPassword(false);

      // Optionally: You can also add any other reset logic or API calls here
    }, [])
  );


   const handleCheckbox  =  ()  =>{
    setCheckbox(prev => prev === 0 ? 1 : 0);
   }



  const validate = () => {
    let isValid = false;

  

    if (mobile === '') {
      setMobileErrormessage('Please Enter Mobile Number');
      isValid = false;
    } else if (mobile.length < 10) {
      setMobileErrormessage('Please Enter 10 digit Number');
      isValid = false;
    } else if (mobile.length > 10) {
      setMobileErrormessage('Please Enter Exactly 10 digit Number');
      isValid = false;
    } else if (!/^\d+$/.test(mobile)) {
      setMobileErrormessage('Please Enter Only Numbers');
      isValid = false;
    } else {
      setMobileErrormessage('');
      isValid = true;
    }

    if (password == '') {
      setPasswordErrormessage('Please Enter Password');
      isValid = false;
    } else if (password != '' && password.length < 5) {
      setPasswordErrormessage('Please Enter Password minimum 5 digit');
      isValid = false;
    } else if (password != '' && password.length > 4) {
      setPasswordErrormessage('');
      isValid = true;
    }

    if (!checkbox) {  
      setCheckboxError('Please Select Checkbox');
      isValid = false;
    } else {
      setCheckboxError(''); 
    }


    return isValid;
  };

  // Login Api
  const LoginApi = async () => {
    setLoding(true);

    console.log('Login Api....');
    try {
      const params = {
        mobile: mobile,
        sw_password: password,
      };

      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const response = await axios.post(
        `${BASE_URL}${LOGIN_USER}`,
        params,
        headers,
      );

      if (response?.data?.status === 200) {
        console.log('response success', response.data);
        // Alert.alert('Success', 'Login successful!');


        AsyncStorage.setItem('UserData', JSON.stringify(response?.data?.user));
        console.log('UserData--- : ', response.data.user);

        AsyncStorage.setItem('UserDataID', JSON.stringify(response?.data?.user.id));
        console.log('UserDataID--- : ', response.data.user.id);

        AsyncStorage.setItem('UserDataMobile', response?.data?.user.mobile);
        console.log('UserDataMobile--- : ', response.data.user.mobile);

        AsyncStorage.setItem('UserDataName', response?.data?.user.name);
        console.log('UserDataName--- : ', response.data.user.name);

        AsyncStorage.setItem('UserToken', response?.data?.user.token);
        console.log('Token--- : ', response.data.user.token);

        AsyncStorage.setItem('UserBoardID', JSON.stringify(response?.data?.user?.board_id));
        console.log('UserBoardID ---:', response?.data?.user?.board_id);

        AsyncStorage.setItem('UserClassID', JSON.stringify(response?.data?.user?.class_id));
        console.log('UserClassID ----', response?.data?.user?.class_id)

        AsyncStorage.setItem('ClassName', JSON.stringify(response?.data?.user?.class_name))
        console.log('ClassName----', response?.data?.user?.class_name)

        const imageUrl = `${BASE_URL}${response?.data?.user?.profile_image}`;
        console.log("profile Image url--->>>", imageUrl);

        AsyncStorage.setItem('StudentProfileImg', imageUrl)
        console.log('.........', imageUrl)



        setLoding(false);
        navigation.navigate('TabNavigator', { screen: 'HomePage' });
        return;
      }

      if (response?.data?.message) {
        console.log("In Vailid ----> ", response?.data?.message)
        // Alert.alert('Aleart',response?.data?.message)
        setMobileErrormessage('Invalid credentials!');
        setPasswordErrormessage('Invalid credentials!');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    } finally {
      setLoding(false);
    }
  };







  return (
    <View style={styles.container}>
      <Image source={require('../images/cartoon.png')} style={styles.cartoon} />

      <ScrollView style={styles.bottomBox}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
          <Text style={styles.welcomeTxt}>Welcome to </Text>
          <Text style={[styles.welcomeTxt, { color: THEME_COLOR }]}>
            KLUnest
          </Text>
        </View>

        <Text style={{ textAlign: 'center', color: 'black' }}>
          Login to continue your journey
        </Text>

        {/* <Text style={styles.enter}>Mobile Number</Text> */}

        <CustomeTextInput
          placeholder="Mobile Number"
          keyboardType="numeric"
          value={mobile}
          maxLength={10}
          // onChangeText={txt => {
          //   // Allow only numbers
          //   const filteredText = txt.replace(/[^0-9]/g, '').slice(0, 10);
          //   setMobile(filteredText);
          // }}
          onChangeText={txt => setMobile(txt)}
          isValid={MobileErrormessage == '' ? true : false}
        />

        {MobileErrormessage != '' && (
          <Text style={styles.errorTxt}>{MobileErrormessage}</Text>
        )}

        {/* <Text style={styles.enter}>Password</Text> */}
        <View style={styles.passwordContainer}>
          <CustomeTextInput
            placeholder={'Enter Password'}
            secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
            value={password}
            onChangeText={txt => setPassword(txt)}
            isValid={PasswordErrormessage == '' ? true : false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'} // "eye" for show, "eye-off" for hide
              size={24}
              color="#000"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>


        {PasswordErrormessage != '' && (
          <Text style={styles.errorTxt}>{PasswordErrormessage}</Text>
        )}

        <View style={styles.termsView}>

          <TouchableOpacity onPress={handleCheckbox}>
          <Icon
            name={checkbox === 1 ? 'check' : null}
            size={24}
            color="#FFF"
            backgroundColor={checkbox ? THEME_COLOR : '#FFF'}
            style={styles.checkbox}
          />
       </TouchableOpacity>


          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Terms')
            }}
          >
            <Text style={{ color: THEME_COLOR2 }}> Terms & condition </Text>
          </TouchableOpacity>
          <Text style={{ color: 'black' }}>
            And
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Privacy')
            }}
          >
            <Text style={{ color: THEME_COLOR2 }}> Privacy policy</Text>
          </TouchableOpacity>
        </View>
        {CheckboxError != '' && (
          <Text style={styles.errorTxt}>{CheckboxError}</Text>
        )}




        <LinearGradient
          colors={[THEME_COLOR, THEME_COLOR2]}
          style={styles.LinearBtn}>
          <TouchableOpacity
            style={styles.LoginBtn}
            onPress={() => {
              const isValid = validate();
              if (isValid) {
                LoginApi();
              }
            }}>
            <Text style={styles.LoginBtn}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('ForgetPasswordStudent')
          }}>
            <Text style={styles.forgate}>Forgot Password ? </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <Text style={styles.forgate}> Register</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}>
          <Text style={styles.forgate}>Login as  </Text>

          <TouchableOpacity onPress={() => navigation.navigate('TeacherLogin')}>
            <Text style={[styles.forgate, { color: THEME_COLOR2 }]}>Teacher</Text>
          </TouchableOpacity>

        </View>




      </ScrollView>
      <Loader visible={loading} />
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  cartoon: {
    width: horizontalScale(355),
    height: verticalScale(200),
    alignSelf: 'center',
  },

  bottomBox: {
    width: horizontalScale(355),
    height: verticalScale(500),
    marginTop: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignSelf: 'center',
  },
  welcomeTxt: {
    fontSize: 25,
    fontWeight: '600',
    color: 'black',
  },

  LinearBtn: {
    width: horizontalScale(290),
    height: verticalScale(40),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: moderateScale(50),
  },

  LoginBtn: {
    width: '100%',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  errorTxt: {
    color: 'red',
    marginLeft: moderateScale(30),
    // marginTop:2
  },
  enter: {
    color: 'black',
    marginTop: 35,
    marginLeft: 40,
    marginBottom: -40,
  },
  forgate: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 32,
    marginTop: 10,
    justifyContent: 'center'
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: -5
  },
  termsView: {
     marginTop:30,
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'center'
    marginLeft:moderateScale(40)
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingLeft: moderateScale(5)
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'gray',

    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: THEME_COLOR,
  },
  checkMark: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
