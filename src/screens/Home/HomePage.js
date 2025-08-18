import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../utils/Colors';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, HOME_USER, VIEW_PROFILE } from '../../constant/StringAPI';
import Loader from '../../components/Loader';
import DashboardStudentV2 from '../DashboardStudentV2';

const HomePage = ({ navigation }) => {
  const [subjectData, setSubjectData] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    HomePageDataApi();
    fetchProfileImage();
    fetchUserName();
    updateGreeting();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      HomePageDataApi();
      fetchProfileImage();
      viewProfileApi();
      const backAction = () => {
        if (navigation.canGoBack()) {
          BackHandler.exitApp();
        } else {
          BackHandler.exitApp();
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  const fetchProfileImage = async () => {
    try {
      const imageUrl = await AsyncStorage.getItem('ProfileImage'); // Make sure the key is correct
      if (imageUrl && imageUrl !== 'null' && imageUrl !== 'undefined') {
        setProfileImage(imageUrl); // Set the profile image immediately when available
        console.log('Fetched profile image:', imageUrl);
      } else {
        setProfileImage(null); // Set to null if no valid profile image is available
        console.log('No profile image found, setting to null.');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImage(null); // In case of an error, set to null
    }
  };

  const fetchUserName = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('UserDataName');
      const StudentProfileImg = await AsyncStorage.getItem('StudentProfileImg');

      if (storedUserName) {
        setName(storedUserName);
        setProfileImage(StudentProfileImg);
      } else {
        console.log('No user name found in AsyncStorage');
      }
    } catch (error) {
      console.log('Error fetching user name:', error);
    }
  };
  const updateGreeting = () => {
    const currentHour = new Date().getHours();
    let greetingMessage = '';

    if (currentHour >= 5 && currentHour < 12) {
      greetingMessage = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      greetingMessage = 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 22) {
      greetingMessage = 'Good Evening';
    } else {
      greetingMessage = 'Good Night'; // Optional for late-night greeting
    }

    setGreeting(greetingMessage);
  };

  const HomePageDataApi = async () => {
    setLoading(true);
    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const UserToken = await AsyncStorage.getItem('UserToken');
      const UserClassID = await AsyncStorage.getItem('UserClassID');
      const UserDataName = await AsyncStorage.getItem('UserDataName');

      const response = await axios.post(
        `${BASE_URL}${HOME_USER}`,
        {
          student_id: UserDataID,
          class_id: UserClassID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${UserToken}`,
          },
        },
      );

      console.log(response.data);

      if (response?.data?.status === 'success') {
        setSubjectData(response.data.subjects);
        AsyncStorage.setItem(
          'SubjectID',
          JSON.stringify(response.data.subjects[0].id),
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjectData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const viewProfileApi = async () => {
    //  setLoding(true)
    console.log('Home View Profile Img Api .......');

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
        // const Image_URL = `${BASE_URL}${response.data.user.profile_image}`;

        // console.log("profileImgggg..",Image_URL)
        // setProfileImage(Image_URL);

        const Image_URL = response.data.user.profile_image
          ? `${BASE_URL}${response.data.user.profile_image}` // If profile image exists, set it with BASE_URL
          : null; // If no profile image, set it as null

        AsyncStorage.setItem('ProfileImage', JSON.stringify(Image_URL)); // Save to AsyncStorage
        console.log('profileImage URL:', Image_URL); // Log the image URL or null

        setProfileImage(Image_URL); // Set state to the URL or null

        // setImage(response.data.user.profile_image)
        // setName(response.data.user.name);
        // setMobile(response.data.user.mobile);
        // setPassword(response.data.user.sw_password);

        // const img = await AsyncStorage.getItem("ProfilImage");
        // console.log("image updtaed url===",img)

        // setLoding(false);
        // updateProfileApi();
        return;
      }
    } catch (error) {
      console.error('Error fetching data', error.message || error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      // setLoding(false);
    }
  };

  return (
    <DashboardStudentV2
      navigation={navigation}
      subjectData={subjectData}
      profileImage={profileImage}
      name={name}
      greeting={greeting}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
};

const Subject = ({ navigation, item, index, searchQuery }) => {
  const colors = [
    'lightcoral',
    'lightgreen',
    'lightpink',
    'lightblue',
    'lightyellow',
    'orange',
  ];

  const getBackgroundColor = index => {
    return colors[index % colors.length];
  };

  const backgroundColor = searchQuery
    ? 'lightgreen' // You can set any color you like here for searched subjects
    : getBackgroundColor(index);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('English', { id: item.id, name: item.name })
      }
      style={[styles.subjectComp, { backgroundColor }]}>
      {/* <Text style={styles.Explore}>{item.id}</Text> */}
      <Text style={styles.Explore}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    width: horizontalScale(345),
    height: verticalScale(150),
    backgroundColor: THEME_COLOR,
    margin: moderateScale(8),
    borderRadius: 10,
  },
  headerContainer: {
    // backgroundColor:'red',
    justifyContent: 'space-evenly',
  },
  profileImg: {
    width: horizontalScale(50),
    height: verticalScale(45),
    // resizeMode: 'contain',
    // backgroundColor: 'grey',
    // borderWidth: 1,
    // tintColor:THEME_COLOR,
    borderRadius: 35,
    marginTop: -18,
    marginLeft: moderateScale(145),
  },
  hello: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 28,
  },
  good: {
    color: 'white',
    fontSize: 18,

    marginLeft: 28,
  },
  searchView: {
    flexDirection: 'row',
    width: horizontalScale(310),
    height: verticalScale(40),
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 25,
    // margin: 20,
  },
  searchInput: {
    width: horizontalScale(250),
    height: verticalScale(40),
    flexDirection: 'row',
  },
  searchImg: {
    width: horizontalScale(25),
    height: verticalScale(25),
    margin: 10,
    resizeMode: 'contain',
  },
  exploreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  Explore: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  viewComp: {
    flex: 1,
    width: horizontalScale(330),
    // flexDirection: 'row',
    margin: 19,
    // backgroundColor:'red'
  },
  subjectComp: {
    width: horizontalScale(138),
    height: verticalScale(150),
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    elevation: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImgCompo: {
    width: horizontalScale(120),
    height: verticalScale(100),
    resizeMode: 'contain',
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(110),
    // height: verticalScale(40),
    // width:horizontalScale(50)
    // justifyContent:'center'
  },

  clearText: {
    fontSize: 18,
    color: THEME_COLOR2, // You can choose any color you want for the cross button
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 100,
    width: horizontalScale(18),
  },
});
