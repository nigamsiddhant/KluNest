import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import CustomeTextInput from '../components/CustomeTextInput';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { BASE_URL, REGISTER_USER, STUDENT_CLASS } from '../constant/StringAPI';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import for icons




const Signup = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [NameErrormessage, setNameErrormessage] = useState('');


  const [selectBoard, setSelectBoard] = useState(1);

  const [SelectBoardErrormessage, setSelectBoardErrormessage] = useState('');



  const [selectedClass, setSelectedClass] = useState("");
  const [SelectClassErrormessage, setSelectClassErrormessage] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  console.log("hhhhhhhh", selectedClassId)



  const [mobile, setMobile] = useState('');
  const [MobileErrormessage, setMobileErrormessage] = useState('')

  const [school, setSchool] = useState('');
  const [SchoolErrormessage, BadSchoolErrormessage] = useState('');


  const [password, setPassword] = useState('');
  const [PasswordErrormessage, setPasswordErrormessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [swPassword, setSwPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [swPasswordErrormessage, setSwPasswordErrormessage] = useState('')

  const [classData, setClassData] = useState([])
  console.log("class Data ....", classData)


  const [loading, setLoding] = useState(false)


  useEffect(() => {
    RegisterClassApi()
  }, [])


  const validate = () => {
    let isValid = false;

    if (name == '') {
      setNameErrormessage('Please Enter Name ');
      isValid = false;
    } else if (name != '') {
      setNameErrormessage('');
      isValid = true;
    }

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

    if (school == '') {
      BadSchoolErrormessage('Please Enter School Name');
      isValid = false;
    } else if (school != '') {
      BadSchoolErrormessage('');
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
    if (swPassword == '') {
      setSwPasswordErrormessage('Please Re Enter Password');
      isValid = false;
    } else if (swPassword != '' && password.length < 5) {
      setSwPasswordErrormessage('Please Re Enter password mimimum 5 digit ');
      isValid = false;
    } else if (password != '' && password.length > 4) {
      setSwPasswordErrormessage('')
      isValid = true;
    }



    return isValid;
  };

  const handleClassChange = (itemValue) => {
    setSelectedClassId(itemValue);


    console.log("Selected Class ID:", itemValue);
  };





  const RegisterApi = async () => {

    setLoding(true)

    console.log('Register Api.... ')

    try {

      const params = {

        name: name,
        board_id: selectBoard,
        class_id: selectedClassId,
        mobile: mobile,
        school_name: school,
        password: password,
        sw_password: swPassword

      };

      console.log("Register params===", params)

      const headers = new Headers();
      headers.append('Content-Type', 'application/json')


      const response = await axios.post(`${BASE_URL}${REGISTER_USER}`,
        params,
        headers,
      );
      console.log('Registration  Data -----', response.data)
      if (response?.data?.code === 200) {
        console.log('response success', response.data.user);
        Alert.alert('Success', 'Registration successful!');
        // navigation.navigate('TabNavigator', { screen: 'HomePage' })
        navigation.navigate('Login')
        setLoding(false)
        return;
      }
      if (response?.data?.message) {
        // console.log('already register ',response?.data?.message?.mobile)
        Alert.alert('Aleart', JSON.stringify(response?.data?.message));
        setMobileErrormessage(JSON.stringify(response?.data?.message?.mobile[0]));
        // setPasswordErrormessage('Invalid credentials!');
        setPasswordErrormessage(JSON.stringify(response?.data?.message?.password[0]))
        setSwPasswordErrormessage(JSON.stringify(response?.data?.message?.sw_password[0]))
      }


    } catch (error) {
      Alert.alert('Registration Error', 'Something went wrong. Please try again.')

    } finally {
      setLoding(false)
    }
  }

  const RegisterClassApi = async () => {
    setLoding(true);
    console.log('Register class Api.....');

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Log the full API URL to ensure it is correct
      const apiUrl = `${BASE_URL}${STUDENT_CLASS}`;
      console.log('Full API URL:', apiUrl);

      const response = await axios.get(apiUrl, { headers });

      console.log('Class Data...', response.data.data);
      setClassData(response?.data?.data)


    } catch (error) {
      console.error('Error registering class:', error.message || error);

    } finally {
      setLoding(false);
    }
  };






  return (
    <View style={styles.container}>
      <Image
        source={require('../images/cartoon2.png')}
        style={styles.cartoon}
      />

      <ScrollView style={styles.bottomBox}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 15 }}>
          <Text style={styles.welcomeTxt}>Welcome to </Text>
          <Text style={[styles.welcomeTxt, { color: THEME_COLOR }]}>
            KLUnest
          </Text>
        </View>

        <Text style={{ textAlign: 'center', color: 'black', marginBottom: 20 }}>
          Create Your Account
        </Text>

        <Text style={styles.enter}>Name</Text>
        <CustomeTextInput
          placeholder={'Name'}
          value={name}
          onChangeText={txt => setName(txt)}
          isValid={NameErrormessage == '' ? true : false}
        />
        {NameErrormessage != '' && <Text style={styles.errorTxt}>{NameErrormessage}</Text>}

        <Text style={styles.enter}>Board</Text>
        <View style={styles.picker12}>
          <Picker
            selectedValue={selectBoard}
            // onValueChange={(itemValue, itemIndex) => setSelectBoard(itemValue)}
            onValueChange={(itemValue) => {
              setSelectBoard(itemValue),
                console.log("value====", itemValue)
            }}
          >
            {/* <Picker.Item label="Select Board" value="select" /> */}
            <Picker.Item label="CBSE Board" value="1" />
            <Picker.Item label="State Board" value="2" />
            {/* <Picker.Item label='ISOC Board' value="3"/> */}
          </Picker>
        </View>
        {SelectBoardErrormessage != '' && (
          <Text style={styles.errorTxt}>{SelectBoardErrormessage}</Text>
        )}

        <Text style={styles.enter}>Class</Text>
        <View style={styles.picker12}>
          <Picker
            selectedValue={selectedClassId}
            onValueChange={handleClassChange} // Handle class selection change
          // style={styles.picker}
          >
            <Picker.Item label="Please select a class" value={null} />
            {/* Render each class in the dropdown */}
            {classData.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
          </Picker>
        </View>



        {SelectClassErrormessage != '' && (
          <Text style={styles.errorTxt}>{SelectClassErrormessage}</Text>
        )}

        <Text style={styles.enter}>Mobile Number</Text>
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

        {MobileErrormessage != '' && <Text style={styles.errorTxt}>{MobileErrormessage}</Text>}

        <Text style={styles.enter}>School</Text>
        <CustomeTextInput
          placeholder={'School'}
          value={school}
          onChangeText={txt => setSchool(txt)}
          isValid={SchoolErrormessage == '' ? true : false}
        />
        {SchoolErrormessage != '' && <Text style={styles.errorTxt}>{SchoolErrormessage}</Text>}

        <Text style={styles.enter}>Password</Text>

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

        <Text style={styles.enter}>Confirm password</Text>
        <View style={styles.passwordContainer}>
          <CustomeTextInput
            placeholder={'Confirm Password'}
            secureTextEntry={!showConfirmPassword} // Toggling visibility
            value={swPassword}
            onChangeText={txt => setSwPassword(txt)}
            isValid={swPasswordErrormessage == '' ? true : false}
          />

          {/* Eye Icon to show/hide password */}
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#000"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {swPasswordErrormessage != '' && (
          <Text style={styles.errorTxt}>{swPasswordErrormessage}</Text>
        )}
        <LinearGradient
          colors={[THEME_COLOR, THEME_COLOR2]}
          style={styles.LinearBtn}>
          <TouchableOpacity
            style={styles.LoginBtn}
            onPress={() => {
              const isValid = validate();
              if (isValid) {
                // navigation.navigate('Home');
                RegisterApi();
              }
            }}>
            <Text style={styles.LoginBtn}>Register</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 5,
          }}>
          <TouchableOpacity>
            {/* <Text style= {styles.forgate}>Forget Password ?    </Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Text style={styles.forgate}> Login</Text>
          </TouchableOpacity>


        </View>

        <View style={{ flexDirection: 'row', textAlign: 'center', marginLeft: 30 }}>
          <Text style={styles.forgate}>Register as  </Text>

          <TouchableOpacity onPress={() => navigation.navigate('TeacherSignup')}>
            <Text style={{ color: THEME_COLOR2, fontSize: 18, fontWeight: 'bold', marginBottom: 50 }}>Teacher</Text>
          </TouchableOpacity>

        </View>


      </ScrollView>
      <Loader visible={loading} />
    </View>
  );
};

export default Signup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLOR,
  },
  cartoon: {
    width: horizontalScale(355),
    height: verticalScale(200),
    alignSelf: 'center',
  },
  bottomBox: {
    width: horizontalScale(360),
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
  picker12: {
    height: horizontalScale(45),
    width: verticalScale(270),
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: moderateScale(30),
    // marginLeft:moderateScale(1),
    marginTop: moderateScale(20),
    marginBottom: 1,
    borderColor: 'grey',
    alignSelf: 'center'
  },

  enter: {
    color: 'black',
    marginTop: 15,
    marginLeft: 45,
    marginBottom: -19,
  },

  LinearBtn: {
    width: horizontalScale(290),
    height: verticalScale(40),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: moderateScale(40),
  },

  LoginBtn: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    // alignSelf:'center'

  },
  errorTxt: {
    color: 'red',
    marginLeft: moderateScale(40),
    // marginTop:2
  },
  forgate: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 1,
    marginBottom: moderateScale(15),
    marginLeft: moderateScale(100),
  },


  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 32,
    // marginTop: 1,
    justifyContent: 'center'
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: -3
  },
});
