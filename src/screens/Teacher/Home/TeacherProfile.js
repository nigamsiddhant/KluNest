import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../components/responsive';
import {THEME_COLOR, THEME_COLOR2} from '../../../utils/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import CustomeTextInput from '../../../components/CustomeTextInput';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BASE_URL,
  TEACHER_UPDATE_PROFILE,
  TEACHER_VIEW_PROFILE,
} from '../../../constant/StringAPI';
import ImageCropPicker from 'react-native-image-crop-picker';

const TeacherProfile = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const [mobile, setMobile] = useState('');
  const [MobileErrormessage, setMobileErrormessage] = useState('');

  const [email, setEmail] = useState('');
  const [EmailErrormessage, setEmailErrormessage] = useState('');

  const [qualification, setQualification] = useState('');
  const [QalificationErrormessage, setQualificationErrormessage] = useState('');

  const [teachingSubject, setTeachingSubject] = useState('');
  const [TeachingSubjectErrormessage, setTeachingErrormessage] = useState('');

  const [image, setImage] = useState({uri: null, base64: null});
  console.log(" techer img ",image)

  useEffect(() => {
    viewTeacherProfileApi();
  }, []);

  const openPicker = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Gallery',
          onPress: openGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      freeStyleCropEnabled: true,
      includeBase64: true,
    })
      .then(image => {
        console.log('i,age base64====', image);
        setImage({uri: image.path, base64: image.data});
      })
      .catch(error => {
        Alert.alert(error.message);
        console.log(error);
      });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      freeStyleCropEnabled: true,
      includeBase64: true,
    })
      .then(image => {
        setImage({uri: image.path, base64: image.data});
      })
      .catch(error => {
        console.log(error);
      });
  };

  const validate = () => {
    let isValid = false;

    if (name == '') {
      setNameErrorMessage('Please Enter Name ');
      isValid = false;
    } else if (mobile != '') {
      setNameErrorMessage('');
      isValid = true;
    }

    // if (password == '') {
    //   setPasswordErrorMessage('Please Enter Password');
    //   isValid = false;
    // } else if (password != '' && password.length < 5) {
    //   setPasswordErrorMessage('Please Enter Password minimum 5 digit');
    //   isValid = false;
    // } else if (password != '' && password.length > 4) {
    //   setPasswordErrorMessage('');
    //   isValid = true;
    // }

    if (email == '') {
      setEmailErrormessage('Please Enter Email');
      isValid = false;
    } else if (email != '') {
      setEmailErrormessage('');
      isValid = true;
    }

    if (qualification == '') {
      setQualificationErrormessage('Please enter qualification');
      isValid = false;
    } else if (qualification != '') {
      setQualificationErrormessage('');
      isValid = true;
    }

    if (teachingSubject == '') {
      setTeachingErrormessage('Please enter Teaching subject');
      isValid = false;
    } else if (teachingSubject != '') {
      setTeachingErrormessage('');
      isValid = true;
    }

    return isValid;
  };

  const viewTeacherProfileApi = async () => {
    console.log('view teacher profile Api........');

    try {
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');
      const TeacherId = await AsyncStorage.getItem('TeacherId');

      console.log('techerToken....', TeacherToken);
      console.log('teacherId...', TeacherId);

      const response = await axios.post(
        `${BASE_URL}${TEACHER_VIEW_PROFILE}`,
        {
          teacher_id: TeacherId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        },
      );

      console.log('nnnnnn', response.data.code);
      console.log(response.data.user);

      console.log(response.data.user.name);

      if (response?.data?.code === '200') {
        console.log(' teacher profile ======', response?.data?.code)

        let profileImageUrl = response.data.user.teacher_image;
        if(profileImageUrl && profileImageUrl !== 'null' && profileImageUrl !== 'undefined' ){
          profileImageUrl = `${BASE_URL}${profileImageUrl}`;
         
          AsyncStorage.setItem('ProfileImage', JSON.stringify(profileImageUrl)); 
          setImage({uri: profileImageUrl}); 
        } else {
        
          AsyncStorage.setItem('ProfileImage', null);
          setImage({uri: null}); 
        }

        


        // const Image_URL = `${BASE_URL}${response.data.user.teacher_image}`;
        // AsyncStorage.setItem('TeacherImage', Image_URL);

        // setImage({uri: Image_URL});

        setName(response.data.user.name);
        setMobile(response.data.user.mobile);
        setEmail(response.data.user.email);
        setQualification(response.data.user.qualification);
        setTeachingSubject(response.data.user.teaching_subject);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const updateTeacherProfileApi = async () => {
    console.log('update Teacher Profile ........');
    try {
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');
      const TeacherId = await AsyncStorage.getItem('TeacherId');

      console.log('teachertoken.....', TeacherToken);
      console.log('techerId.....', TeacherId);

      let params = new FormData();
      params.append('teacher_id', TeacherId);
      params.append('teacher_image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'teacher_image.jpg',
      });
      params.append('name', name);
      params.append('email', email);
      params.append('qualification', qualification);
      params.append('teaching_subject', teachingSubject);

      console.log('profile params....', params);
      const response = await axios.post(
        `${BASE_URL}${TEACHER_UPDATE_PROFILE}`,
        params,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${TeacherToken}`,
          },
        },
      );

      console.log('teacher update....', response.data);
      console.log('teacher Image..', response.data.user.teacher_image)
      viewTeacherProfileApi()
      // if(response?.data?.)
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('TeacherToken'); 
      // await AsyncStorage.clear(); // Clear AsyncStorage
      // navigation.navigate('TeacherLogin'); // Navigate to Login
    } catch (error) {
      console.error('Failed to clear the storage:', error); // Handle errors
    }
  };

  const updateBtn = async () => {
    validate();
    Alert.alert('Confirm', 'Are You Sure you want to submit ? ', [
      {
        text: 'Cancel',
        onPress: () => console.log('Submission Cancel'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await updateTeacherProfileApi();
          Alert.alert('Success', 'Profile updated successfully!');
        },
      },
    ]);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'lightgreen'}}>
      <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../images/BackBtn.png')}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <Text style={styles.headTxt}>Profile</Text>
      </View>
      <ScrollView style={styles.bottomBox}>
        <View style={styles.viewImg}>
          {/* <Image
          source={require('../../../images/User.png')} // Ensure this path is correct
          style={styles.profileImg}
        /> */}
          
          {image && image.uri ? (
          <Image source={{uri: image.uri}} 
          style={styles.profileImg} 
          />
        ) : (
          <Image
            source={require('../../../images/User.png')} // Ensure this path is correct
            style={styles.profileImg}
          />
        )}

          {/* <Image
            source={
              image?.uri
                ? {uri: image.uri}
                : require('../../../images/User.png')
            }
            style={styles.profileImg}
          /> */}

          <TouchableOpacity
            style={styles.pickerBackground}
            onPress={openPicker}>
            <Image
              source={require('../../../images/ImagePickup.png')}
              style={styles.picker}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.enter}>Name</Text>
        <CustomeTextInput
          placeholder={'Name'}
          value={name}
          onChangeText={txt => setName(txt)}
          isValid={nameErrorMessage === ''}
        />
        {nameErrorMessage !== '' && (
          <Text style={styles.errorTxt}>{nameErrorMessage}</Text>
        )}

        <Text style={styles.enter}>Mobile Number</Text>
        <CustomeTextInput
          placeholder={'Mobile'}
          value={mobile}
          editable={false}
          onChangeText={txt => setMobile(txt)}
          isValid={MobileErrormessage === ''}
        />
        {MobileErrormessage !== '' && (
          <Text style={styles.errorTxt}>{MobileErrormessage}</Text>
        )}

        <Text style={styles.enter}>Email</Text>
        <CustomeTextInput
          placeholder={'Email address'}
          value={email}
          onChangeText={txt => setEmail(txt)}
          isValid={EmailErrormessage === ''}
        />
        {EmailErrormessage !== '' && (
          <Text style={styles.errorTxt}>{EmailErrormessage}</Text>
        )}

        <Text style={styles.enter}>Qualification</Text>
        <CustomeTextInput
          placeholder={'Qualification'}
          value={qualification}
          onChangeText={txt => setQualification(txt)}
          isValid={QalificationErrormessage === ''}
        />
        {QalificationErrormessage !== '' && (
          <Text style={styles.errorTxt}>{QalificationErrormessage}</Text>
        )}

        {/* <Text style={styles.enter}>Teaching Subject</Text>
        <CustomeTextInput
          placeholder={'Teaching subject'}
          value={teachingSubject}
          onChangeText={txt => setTeachingSubject(txt)}
          isValid={TeachingSubjectErrormessage === ''}
        />
        {TeachingSubjectErrormessage !== '' && (
          <Text style={styles.errorTxt}>{TeachingSubjectErrormessage}</Text>
        )} */}

        <LinearGradient
          colors={[THEME_COLOR, THEME_COLOR2]}
          style={styles.LinearBtn}>
          <TouchableOpacity style={styles.LoginBtn} onPress={updateBtn}>
            <Text style={styles.LoginBtn}>Update</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#D6443D', 'red']}
          style={[styles.LinearBtn, {marginBottom: moderateScale(80)}]}>
          <TouchableOpacity style={styles.LoginBtn} 
          onPress={() =>{
            navigation.replace('TeacherLogin')
            logout()
          }}>
            <Text style={styles.LoginBtn}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* <Text>TeacherProfile</Text> */}
    </View>
  );
};

export default TeacherProfile;
const styles = StyleSheet.create({
  heading: {
    width: horizontalScale(360),
    height: verticalScale(50),
    alignSelf: 'center',
    flexDirection: 'row',
    padding: moderateScale(12),
    backgroundColor: '#E9E9E9',
  },
  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
    marginTop: moderateScale(10),
  },
  headTxt: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    marginLeft: moderateScale(120),
    color: THEME_COLOR2,
  },

  viewImg: {
    width: horizontalScale(100),
    height: verticalScale(90),
    // backgroundColor: '#E9E9E9',
    // backgroundColor: '#dadada',
    alignSelf: 'center',
    margin: 50,
    borderRadius: 100,
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileImg: {
    width: horizontalScale(109),
    height: verticalScale(99),
    resizeMode: 'contain',
    borderRadius: 62,
    // backgroundColor:'red',
    // tintColor: 'pink',
  },

  pickerBackground: {
    width: horizontalScale(39),
    height: verticalScale(35),
    // position: 'absolute',
    bottom: -10,
    marginLeft: 95,
    marginTop: -43,
    backgroundColor: THEME_COLOR,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: horizontalScale(25),
    height: verticalScale(25),
    resizeMode: 'contain',
  },

  bottomBox: {
    width: horizontalScale(360),
    height: verticalScale(500),
    marginTop: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignSelf: 'center',
  },
  enter: {
    color: 'black',
    marginTop: 15,
    marginLeft: 45,
    marginBottom: -19,
  },
  errorTxt: {
    color: 'red',
    marginLeft: moderateScale(40),
  },

  LinearBtn: {
    width: horizontalScale(290),
    height: verticalScale(40),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: moderateScale(20),
  },
  LoginBtn: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
