import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors'
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive'
import { ScrollView } from 'react-native-gesture-handler'
import CustomeTextInput from '../../../components/CustomeTextInput'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { BASE_URL, TEACHER_REGISTER, TEACHER_SELECT_SUBJECT } from '../../../constant/StringAPI'
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import for icons
import { Picker } from '@react-native-picker/picker';



const TeacherSignup = () => {


  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [NameErrormessage, setNameErrormessage] = useState('');

  const [mobile, setMobile] = useState('');
  const [MobileErrormessage, setMobileErrormessage] = useState('')

  const [email, setEmail] = useState('');
  const [EmailErrormessage, setEmailErrormessage] = useState('')

  const [qualification, setQualification] = useState('')
  const [QualificationErrormessage, setQualificationErrormessage] = useState('')

  const [subject, setSubject] = useState('');
  const [SubjectErrormessage, setSubjectErrormessage] = useState('');

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [PasswordErrormessage, setPasswordErrormessage] = useState('')

  const [swPassword, setSwPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [SwPasswordErrormessage, setSwPasswordErrormessage] = useState('')


  const [subjectData, setSubjectData] = useState([])
  //  console.log("subject Data Top", subjectData)

  const [selectSubjectId, setSelectSubjectId] = useState(null)


  const [loading, setLoding] = useState(false)

  useEffect(() => {
    TeacherSubjectApi()
  }, [])





  const validate = () => {
    let isValid = false

    if (name == '') {
      setNameErrormessage('Please Enter Name')
      isValid = false
    } else if (name != '') {
      setNameErrormessage('');
      isValid = true
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


    if (email === '') {
      setEmailErrormessage('Please Enter Email');
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      // This regex checks for a valid email format
      setEmailErrormessage('Please Enter a Valid Email');
      isValid = false;
    } else {
      setEmailErrormessage('');
      isValid = true;
    }


    if (qualification === '') {
      setQualificationErrormessage("Please Enter Qualification");
      isValid = false
    } else {
      setQualificationErrormessage('');
      isValid = true
    }

    if (subject === '') {
      setSubjectErrormessage("Please Enter Teaching Subject");
      isValid = false
    } else {
      setSubjectErrormessage('');
      isValid = true
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
      setSwPasswordErrormessage('Please Enter Re Password');
      isValid = false;
    } else if (swPassword != '' && password.length < 5) {
      setSwPasswordErrormessage('Please Enter Re Password minimum 5 digit')
      isValid = false;
    } else if (password != '' && password.length > 4) {
      setSwPasswordErrormessage('');
      isValid = true
    }


    return isValid
  }

  const handleSubjectChange = (itemValue) => {
    setSelectSubjectId(itemValue)

    console.log("Selected Subject ID:", itemValue);
  }



  const TeacherRegistationApi = async () => {
    console.log("Teacher register Api.......")
    setLoding(true)

    try {

      const params = {
        name: name,
        mobile: mobile,
        email: email,
        qualification: qualification,
        teaching_subject_id: selectSubjectId,
        password: password,
        sw_password: swPassword,
      }
      console.log("Teacher Registre params ---", params)

      const headers = new Headers();
      headers.append('Content-Type', 'application/json')


      const response = await axios.post(
        `${BASE_URL}${TEACHER_REGISTER}`,
        params,
        headers,
      )
      console.log('Registration  Data -----', response.data)
      console.log("respons success ", response.data.code)
      if (response?.data?.code === 200) {
        // console.log("respons success ", response.data)
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('TeacherLogin');
        setLoding(false)
        return;
      }
      if (response?.data?.message) {
        Alert.alert('Alert', JSON.stringify(response?.data?.message));
        setMobileErrormessage(JSON.stringify(response?.data?.message?.mobile[0]));

        // Alert.alert("Alert",JSON.stringify(response?.data?.message?.sw_password[0]));
        setPasswordErrormessage(JSON.stringify(response?.data?.message?.password[0]))
        setSwPasswordErrormessage(JSON.stringify(response.data.message.sw_password[0]));

      }



    } catch (error) {
      Alert.alert('Registration Error', 'Something went wrong. Please try again.')
    } finally {
      setLoding(false)
    }

  }


  const TeacherSubjectApi = async () => {
    setLoding(true);
    console.log('Register master subject Api.....');

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Log the full API URL to ensure it is correct
      const apiUrl = `${BASE_URL}${TEACHER_SELECT_SUBJECT}`;
      console.log('Full API URL:', apiUrl);

      const response = await axios.get(apiUrl, { headers });

      console.log('Subject Data...', response.data.data);
      setSubjectData(response?.data?.data)


    } catch (error) {
      console.error('Error registering class:', error.message || error);

    } finally {
      setLoding(false);
    }
  };







  return (
    <View style={styles.container}>
      <Image

        source={require('../../../images/cartoon2.png')}
        style={styles.cartoon}
      />
      <ScrollView style={styles.bottomBox}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 15 }}>
          <Text style={styles.welcomeTxt}>Welcome to </Text>
          <Text style={[styles.welcomeTxt, { color: THEME_COLOR }]}>
            KLUnest
          </Text>
        </View>

        <Text style={[styles.welcomeTxt, { color: THEME_COLOR2, textAlign: 'center' }]}>
          Register As Teacher
        </Text>

        <Text style={styles.enter}>Name</Text>
        <CustomeTextInput
          placeholder={'Name'}
          value={name}
          onChangeText={txt => setName(txt)}
          isValid={NameErrormessage == '' ? true : false}
        />
        {NameErrormessage != '' && <Text style={styles.errorTxt}>{NameErrormessage}</Text>}



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

        <Text style={styles.enter}>Email Address</Text>
        <CustomeTextInput
          placeholder="Email Address"
          value={email}
          onChangeText={txt => setEmail(txt)}
          isValid={EmailErrormessage == '' ? true : false}
        />
        {EmailErrormessage != '' && <Text style={styles.errorTxt}>{EmailErrormessage}</Text>}


        <Text style={styles.enter}>Qualification</Text>
        <CustomeTextInput
          placeholder="Qualification"
          value={qualification}
          onChangeText={txt => setQualification(txt)}
          isValid={QualificationErrormessage == '' ? true : false}
        />
        {QualificationErrormessage != '' && <Text style={styles.errorTxt}>{QualificationErrormessage}</Text>}


        <Text style={styles.enter}>Teaching Subject</Text>
        {/* <CustomeTextInput
          placeholder="Teaching Subject"
          value={subject}
          onChangeText={txt => setSubject(txt)}
          isValid={SubjectErrormessage == '' ? true : false}
          />
        {SubjectErrormessage != '' && <Text style={styles.errorTxt}>{SubjectErrormessage}</Text>} */}

        <View style={styles.picker12}>
          <Picker
            selectedValue={selectSubjectId}
            onValueChange={handleSubjectChange}

          >

            {subjectData.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}

          </Picker>



        </View>





        <Text style={styles.enter} > Password</Text>
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
        {PasswordErrormessage != '' && <Text style={styles.errorTxt}>{PasswordErrormessage}</Text>}

        <Text style={styles.enter}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <CustomeTextInput
            placeholder={'Confirm Password'}
            secureTextEntry={!showConfirmPassword} // Toggling visibility
            value={swPassword}
            onChangeText={txt => setSwPassword(txt)}
            isValid={SwPasswordErrormessage == '' ? true : false}
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
        {SwPasswordErrormessage != '' && <Text style={styles.errorTxt}>{SwPasswordErrormessage}</Text>}



        <LinearGradient
          colors={[THEME_COLOR, THEME_COLOR2]}
          style={styles.LinearBtn}>
          <TouchableOpacity
            style={styles.LoginBtn}
            onPress={() => {

              // navigation.navigate('TeacherHome');
              const isValid = validate();
              if (isValid) {
                // navigation.navigate('TeacherHome');
                TeacherRegistationApi();
              }
            }}
          >
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
              navigation.navigate('TeacherLogin');
            }}>
            <Text style={styles.forgate}> Login</Text>
          </TouchableOpacity>
        </View>


        <View style={{ flexDirection: 'row', textAlign: 'center', marginLeft: 30 }}>
          <Text style={styles.forgate}>Register as  </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: THEME_COLOR2, fontSize: 18, fontWeight: 'bold', marginBottom: 50 }}>Student</Text>
          </TouchableOpacity>

        </View>


      </ScrollView>


    </View>
  )
}

export default TeacherSignup
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
    marginLeft: 33,
    marginTop: 20,
    marginBottom: 1,
    borderColor: 'grey',
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

})