import { View, Text, StyleSheet, Image, ScrollView, BackHandler, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, TEACHER_SUBJECT, TEACHER_VIEW_PROFILE } from '../../../constant/StringAPI';
import { useFocusEffect } from '@react-navigation/native';

const TeacherHome = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState();
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const [subjectData, setSubjectData] = useState('');

  useEffect(() => {
    fetchUserName();
    fetchProfileImage();
    updateGreeting();
    TeacherHomePageApi();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // HomePageDataApi();
      fetchProfileImage();
      viewTeacherProfileApi();
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

      const imageUrl = await AsyncStorage.getItem('ProfileImage');
      
      if (imageUrl) {
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const fetchUserName = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('TeacherName');
      const TeacherProfileImg = await AsyncStorage.getItem('TeacherProfileImg')
      if (storedUserName) {
        
        setName(storedUserName);
        setProfileImage(TeacherProfileImg)
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

  // Fetch data for teacher's subjects
  const TeacherHomePageApi = async () => {
    setLoading(true);
    console.log('Home page api...');

    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');
      
      console.log(TeacherId);
      console.log(TeacherToken);
      
      const response = await axios.post(
        `${BASE_URL}${TEACHER_SUBJECT}`,
        {
          teacher_id: TeacherId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        },
      );
      
      console.log('Subject data:', response.data);
      console.log('Subject data:', response.data.data.name);
    
      // if (response.data && Array.isArray(response.data.data)) {
      //   setSubjectData(response.data.data); // Set the correct array to state
      // }
      if(response.data.code === 200){
        setSubjectData(response.data.data)
      }




    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false);
    }
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
      // console.log(response.data.user);

      console.log(response.data.user.name);

      if (response?.data?.code === '200') {
        const Image_URL = `${BASE_URL}${response.data.user.teacher_image}`;
        AsyncStorage.setItem('TeacherProfileImg', Image_URL);
        setProfileImage(Image_URL);

        console.log('url.......',Image_URL)

        // setName(response.data.user.name);
        // setMobile(response.data.user.mobile);
        // setEmail(response.data.user.email);
        // setQualification(response.data.user.qualification);
        // setTeachingSubject(response.data.user.teaching_subject);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };





  const renderItem = ({ item }) => {
    return (
       <TouchableOpacity 
       style={styles.itemContainer}
       onPress={() => navigation.navigate('TeacherSubject', {SubjectId: item.id, name: item.name})}
       >
        <Text style={styles.subjectName}>{item.name}</Text>

       </TouchableOpacity>


      // <View style={styles.itemContainer}>
      //   <Text style={styles.name}>{item.name}</Text>
      //   {/* Assuming each subject has a 'subject_code' */}
      //   {/* <Text style={styles.age}>Subject Code: {item.subject_code}</Text> */}
      // </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[THEME_COLOR, THEME_COLOR2]} 
        style={styles.topView}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.hello}>Hello,</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../../../images/User.png')}
                style={styles.profileImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={{ marginTop: moderateScale(-30), marginBottom: moderateScale(15) }}>
              <Text style={styles.good}>{greeting},</Text>
              <Text style={[styles.good, { color: 'lightgreen', fontWeight: '600', fontSize: 20 }]}>{name}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

     
      {/* <FlatList
        style={styles.viewComp}
        contentContainerStyle={{paddingBottom:moderateScale(50)}}
        numColumns={2} 
        data={subjectData} 
        renderItem={renderItem} 
        keyExtractor={item => item.id.toString()} 
        ListEmptyComponent={<Text style={styles.emptyText}>No subjects available.</Text>} // Display this when there are no subjects
        refreshing={loading}
        onRefresh={TeacherHomePageApi} 
      /> */}
      <View style={styles.viewComp}>
      <TouchableOpacity 
       style={styles.itemContainer}
       onPress={() => navigation.navigate('TeacherSubject', {SubjectId: subjectData.id, name: subjectData.name})}
       >
       {/* <Text>{subjectData.id}</Text> */}
       <Text style={styles.name}>{subjectData.name}</Text>

       </TouchableOpacity>
      </View>


    </View>
  );
};

export default TeacherHome;

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
    justifyContent: 'space-evenly',
  },
  hello: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 28,
  },
  profileImg: {
    width: horizontalScale(50),
    height: verticalScale(45),
    resizeMode: 'contain',
    backgroundColor: THEME_COLOR,
    borderRadius: 35,
    marginTop: -20,
    marginLeft: moderateScale(280),
  },
  good: {
    color: 'white',
    fontSize: 18,
    marginLeft: 28,
  },
  itemContainer: {
    width: horizontalScale(140),
    height: verticalScale(140),
    backgroundColor: '#CBC3E3',
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: '3%', 
    justifyContent:'center',

  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  viewComp: {
    flex: 1, // Ensure the FlatList takes up the available space
    padding: moderateScale(25),
    marginTop: 20,
    // marginBottom: moderateScale(-20),
    // backgroundColor:'red',
    paddingBottom:50,
    marginBottom:15

  },
  subjectName:{
    fontSize:20,
    fontWeight:'600'
  }
});
