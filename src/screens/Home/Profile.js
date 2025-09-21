import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../utils/Colors';
import CustomeTextInput from '../../components/CustomeTextInput';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import Loader from '../../components/Loader';
import axios from 'axios';
import { BASE_URL, UPDATE_PROFILE, VIEW_PROFILE } from '../../constant/StringAPI';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import for icons

const Profile = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const [mobile, setMobile] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  // const [image, setImage] = useState(null);
  const [image, setImage] = useState({ uri: null, base64: null });
  const [loading, setLoding] = useState(false);

  useEffect(() => {
    console.log('image===', image);
    viewProfileApi();
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
      { cancelable: true },
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
        setImage({ uri: image.path, base64: image.data });
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
        setImage({ uri: image.path, base64: image.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const logout = async () => {
    console.log("logout")
    try {

      await AsyncStorage.removeItem('UserToken'); // Clear AsyncStorage
      console.log("...logout")
      // navigation.navigate('Login'); // Navigate to Login
    } catch (error) {
      console.error('Failed to clear the storage:', error); // Handle errors
    }
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

    if (password == '') {
      setPasswordErrorMessage('Please Enter Password');
      isValid = false;
    } else if (password != '' && password.length < 5) {
      setPasswordErrorMessage('Please Enter Password minimum 5 digit');
      isValid = false;
    } else if (password != '' && password.length > 4) {
      setPasswordErrorMessage('');
      isValid = true;
    }

    return isValid;
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
          await updateProfileApi();
          Alert.alert('Success', 'Profile updated successfully!');
        },

      },
    ]);
  };

  const viewProfileApi = async () => {
    setLoding(true)
    console.log('View Profile Api .......');


    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const UserToken = await AsyncStorage.getItem('UserToken');

      console.log(UserDataID);
      console.log(UserToken);

      const response = await axios.post(
        `${BASE_URL}${VIEW_PROFILE}`,
        {
          student_id: UserDataID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${UserToken}`,
          },
        },
      );

      console.log('api response profile---->>>>', response.data);
      console.log('api response profile---->>>>', response.data.code);
      console.log('api response name---->>>>', response.data.user.name);

      if (response?.data?.code === '200') {
        console.log(' hello======', response?.data?.code);


        let profileImageUrl = response.data.user.profile_image;
        if (profileImageUrl && profileImageUrl !== 'null' && profileImageUrl !== 'undefined') {

          profileImageUrl = `${BASE_URL}${profileImageUrl}`;
          AsyncStorage.setItem('ProfileImage', JSON.stringify(profileImageUrl));
          setImage({ uri: profileImageUrl });
        } else {

          AsyncStorage.setItem('ProfileImage', null);
          setImage({ uri: null });
        }

        // Set other profile details
        setName(response.data.user.name);
        setMobile(response.data.user.mobile);
        // setPassword(response.data.user.sw_password);

        setLoding(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching data', error.message || error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoding(false);
    }
  };


  const updateProfileApi = async () => {
    setLoding(true);
    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const UserToken = await AsyncStorage.getItem('UserToken');

      // if (!image.base64) {
      //   Alert.alert('Error', 'Please select an image before updating.');
      //   return;
      // }

      let params = new FormData();
      params.append('student_id', UserDataID);
      params.append('profile_image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
      });
      params.append('name', name);
      params.append('sw_password', password);

      const response = await axios.post(
        `${BASE_URL}${UPDATE_PROFILE}`,
        params,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${UserToken}`,
          },
        },
      );

      // console.log("Update API response:", response.data);
      //  console.log("Profile-Image", response.data.user.profile_image)
      //  setImage(response.data.user.profile_image)

      if (response?.data?.code === 200) {
        console.log('Update API response:', response.data);
        console.log('Profile-Image', response.data.user.profile_image);

        console.log('ProfilImg.......', response.data.user.profile_image);
        console.log('ProfilImg.......', response.data.user.profile_image);
        Alert.alert('Update', 'Updated Successfully.');
        viewProfileApi();
      }

      setLoding(false);
      // Handle the response as needed
    } catch (error) {
      console.error(
        'Error updating profile:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoding(false);
    }
  };

  return (
    <View style={styles.container}>


      <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../images/BackBtn.png')} style={styles.backBtn} />
        </TouchableOpacity>
        <Text style={styles.headingTxt}>  Profile</Text>
      </LinearGradient>
      <ScrollView style={styles.bottomBox}>
        <View style={styles.viewImg}>
          {image && image.uri ? (
            <Image source={{ uri: image.uri }} style={styles.profileImg} />
          ) : (
            <Image
              source={require('../../images/User.png')} // Ensure this path is correct
              style={styles.profileImg}
            />
          )}

          <TouchableOpacity style={styles.pickerBackground} onPress={openPicker}>
            <Image
              source={require('../../images/ImagePickup.png')}
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
          placeholder="Mobile Number"
          placeholderTextColor="red"
          keyboardType="numeric"
          value={mobile}
          editable={false}
          // placeholderTextColor='red'

          onChangeText={txt => {
            const filteredText = txt.replace(/[^0-9]/g, '').slice(0, 10);
            setMobile(filteredText);
          }}
          isValid={mobileErrorMessage === ''}
        />
        {mobileErrorMessage !== '' && (
          <Text style={styles.errorTxt}>{mobileErrorMessage}</Text>
        )}





        {/* <LinearGradient
          colors={[THEME_COLOR, THEME_COLOR2]}
          style={[styles.LinearBtn, { marginBottom: moderateScale(-25) }]}>
          <TouchableOpacity style={styles.LoginBtn} onPress={updateBtn}>
            <Text style={styles.LoginBtn}>Update</Text>
          </TouchableOpacity>
        </LinearGradient> */}

        <TouchableOpacity style={styles.buyNowButton} onPress={updateBtn}>
          <Text style={styles.buyNowText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => {
          navigation.replace('LoginInitialScreen');
          logout()
        }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* <LinearGradient
          colors={['#D6443D', 'red']}
          style={[styles.LinearBtn, { marginBottom: moderateScale(3) }]}>
          <TouchableOpacity style={styles.LoginBtn}
            onPress={() => {
              navigation.replace('LoginInitialScreen');
              logout()
            }}>
            <Text style={styles.LoginBtn}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient> */}


        <View style={styles.termsView}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Terms')
            }}
          >
            <Text style={{ color: THEME_COLOR2 }}> Terms & condition </Text>
          </TouchableOpacity>
          <Text style={{ color: 'black' }}>

          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Privacy')
            }}
          >
            <Text style={{ color: THEME_COLOR2 }}> Privacy policy</Text>
          </TouchableOpacity>

          <Text style={{ color: 'black' }}>

          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ContactUs')
            }}
          >
            <Text style={{ color: THEME_COLOR2 }}> Contact us</Text>
          </TouchableOpacity>

          <Text style={{ color: 'black' }}>

          </Text>


          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cancellation')
            }}
          >
            <Text style={{ color: THEME_COLOR2 }}> Cancellation and refund</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
      <Loader visible={loading} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
    width: horizontalScale(120),
    height: verticalScale(100),
    // backgroundColor: '#E9E9E9',
    // backgroundColor: '#dadada',
    alignSelf: 'center',
    margin: 50,
    borderRadius: 100,
    // borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    width: horizontalScale(109),
    height: verticalScale(99),
    resizeMode: 'contain',
    borderRadius: 62,

  },
  bottomBox: {
    width: horizontalScale(360),
    // height: verticalScale(500),
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
  buyNowButton: {
    backgroundColor: '#1ABC9C',
    marginBottom: moderateScale(-25),
    width: horizontalScale(290),
    height: verticalScale(40),
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(50),
  },
  buyNowText: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    width: horizontalScale(290),
    height: verticalScale(40),
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(50),
    borderWidth: 1,
    borderColor: '#1ABC9C',
  },
  logoutText: {
    width: '100%',
    color: '#1ABC9C',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  LinearBtn: {
    width: horizontalScale(290),
    height: verticalScale(40),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  LoginBtn: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorTxt: {
    color: 'red',
    marginLeft: moderateScale(40),
  },
  pickerBackground: {
    width: horizontalScale(39),
    height: verticalScale(35),
    position: 'absolute',
    bottom: -20,
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

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 32,
    // marginTop: 10,
    justifyContent: 'center',

  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: -5,
  },
  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
    tintColor: 'white',
    alignSelf: 'center',
  },

  headingTxt: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    color: 'white',
  },

  heading: {
    width: horizontalScale(360),
    height: verticalScale(60),
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
  },

  termsView: {
    marginTop: 50,
    // flexDirection:'row',
    alignItems: 'center',
    // alignSelf:'center'
    marginBottom: 20
  }
});
