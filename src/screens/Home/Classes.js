import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, STUDENT_MEETING} from '../../constant/StringAPI';
import {FlatList} from 'react-native-gesture-handler';
import {THEME_COLOR, THEME_COLOR2} from '../../utils/Colors';
import Loader from '../../components/Loader';
import { useFocusEffect } from '@react-navigation/native';

const Classes = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [studentDoubtData, setStudentDoubtData] = useState([]);

  console.log('student.....----', studentDoubtData);

  // useEffect(() => {
  //   StudentDoubtClassApi();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      StudentDoubtClassApi();
    }, [])
  );


  const StudentDoubtClassApi = async () => {
    console.log('StudentDoubtClassApi.........');
    setLoading(true);

    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const UserToken = await AsyncStorage.getItem('UserToken');

      const response = await axios.post(
        `${BASE_URL}${STUDENT_MEETING}`,
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

      console.log('Student list........', response.data.meetings);

      if (response.data.code === 200) {
        // Assuming `meetings` is an array, you should set the state to that array, not just a single object
        setStudentDoubtData(response?.data?.meetings);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false); // Make sure to hide loader once data is fetched
    }
  };

  const renderItem = ({item}) => {
    console.log('Item....', item);
    return (
      <View style={styles.itemContainer}>
        <View style={{flexDirection: 'row', width: horizontalScale(200)}}>
          <Text style={styles.containerTxt}>Chapter :</Text>
          <Text> {item.chapter_name}</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.containerTxt}>Subject :</Text>
          <Text> {item.subject_name}</Text>
        </View>
        <View style={{flexDirection: 'row', width: horizontalScale(200)}}>
          <Text style={styles.containerTxt}>Content :</Text>
          <Text> {item.question_name}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.containerTxt}>Teacher :</Text>
          <Text> {item.teacher_name}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.containerTxt}>Meeting Date & Time :</Text>
          <Text> {item.meeting_datetime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backBtn}
            source={require('../../images/BackBtn.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTxt}>Classes</Text>
      </View>

      <View style={styles.ViewCamp}>
        {/* FlatList to show the classes */}
        <FlatList
          style={styles.ViewCamp}
          contentContainerStyle={{paddingBottom: moderateScale(50)}}
          data={studentDoubtData.slice().reverse()} // Reverses the array
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Meeting available.</Text>
          }
          refreshing={loading} // Show the loader when refreshing
        />
      </View>
      
      {/* The global loader for the whole screen */}
      <Loader visible={loading}/>
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({
  header: {
    width: horizontalScale(360),
    height: verticalScale(50),
    backgroundColor: 'lightgray',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTxt: {
    fontSize: 25,
    fontWeight: '600',
    marginLeft: moderateScale(110),
    color: THEME_COLOR2,
  },
  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
    marginTop: moderateScale(10),
    marginLeft: moderateScale(10),
  },
  ViewCamp: {
    flex: 1,
    marginTop: moderateScale(20),
  },
  itemContainer: {
    width: horizontalScale(300),
    backgroundColor: 'white',
    marginBottom: moderateScale(15),
    borderRadius: moderateScale(8),
    justifyContent: 'space-between',
    alignSelf: 'center',
    elevation: 10,
    padding: moderateScale(10),
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  containerTxt: {
    fontSize: 16,
    fontWeight: '700',
  },
});
