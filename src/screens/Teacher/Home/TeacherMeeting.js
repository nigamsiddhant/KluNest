import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../components/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BASE_URL,
  START_THE_MEETING,
  TEACHER_MEETING,
} from '../../../constant/StringAPI';
import {THEME_COLOR, THEME_COLOR2} from '../../../utils/Colors';

const TeacherMeeting = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState([]);

  const sortedData = meetingData.sort((b, a) => a.id - b.id);

  useEffect(() => {
    TeacherMeetingApi();
  }, []);

  const TeacherMeetingApi = async () => {
    setLoading(true);
    console.log('Teacher Meeting Api......');

    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');

      console.log(TeacherId);
      console.log(TeacherToken);

      const response = await axios.post(
        `${BASE_URL}${TEACHER_MEETING}`,
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

      console.log('teacher mettings', response.data);

      setMeetingData(response?.data?.meetings);
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async studentId => {
    console.log('studentd id',studentId)
    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');

      console.log(TeacherId);
      console.log(TeacherToken);

      console.log('start meeting params', {
        teacher_id: TeacherId,
        student_id: studentId,
      });

      const response = await axios.post(
        `${BASE_URL}${START_THE_MEETING}`,
        {
          teacher_id: TeacherId,
          student_id: studentId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        },
      );

      console.log('start metting',response.data)

      if (response?.data?.status === 'success') {
        const result = response.data.data;
        navigation.navigate('teacherVideoCallWaiting', {
          teacherId: TeacherId,
          videoCallId: result.video_call_id,
          channelName: result.channel_name,
          channelToken: result.agora_token,
        });
      }
      console.log('start meeting', response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
    }
  };

  const renderItem = ({item}) => (
    <View >
      <View style={styles.itemContainer}>
        <View>
          {/* <Text>{item.id}</Text> */}

          <View style={{flexDirection: 'row', marginTop: verticalScale(7)}}>
            <Text style={{fontWeight: '600'}}>Student Name : </Text>
            <Text> {item.student_name ? item.student_name : null}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: verticalScale(7)}}>
            <Text style={{fontWeight: '600'}}>Student Subject : </Text>
            <Text style={{marginLeft: horizontalScale(2)}}>
              {item.subject_name}
            </Text>
          </View>
          <View
            style={{
              width: horizontalScale(220),
              marginTop: verticalScale(7),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={{fontWeight: '600'}}>Chapter Name : </Text>
            <Text
              style={{
                flexWrap: 'wrap',
                flexShrink: 1,
                marginLeft: horizontalScale(2),
              }}>
              {item.chapter_name}
            </Text>
          </View>

          {/* <Text>{item.question_name }</Text> */}
          {/* <Text>{item.class_name ? item.class_name : null}</Text> */}
          <View style={{flexDirection: 'row', marginTop: verticalScale(7)}}>
            <Text style={{fontWeight: '600'}}>Teacher Name : </Text>
            <Text style={{marginLeft: horizontalScale(2)}}>
              {item.teacher_name ? item.teacher_name : null}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: verticalScale(7)}}>
            <Text style={{fontWeight: '600'}}>School Name :</Text>
            <Text style={{marginLeft: horizontalScale(2)}}>
              {item.school_name ? item.school_name : null}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: verticalScale(7)}}>
            <Text style={{fontWeight: '600'}}>Student Mobile Number : </Text>
            <Text style={{marginLeft: horizontalScale(2)}}>
              {item.student_mobile ? item.student_mobile : null}
            </Text>
          </View>
          <View style={{flexDirection:'row', marginTop:verticalScale(7)}}>
            <Text style={{fontWeight:'600'}}>Meeting Date & Time : </Text>
          <Text>{item.meeting_datetime ? item.meeting_datetime : null}</Text>
          </View>
          <View>
            <Text style={{fontWeight:'600'}}>Doubt : </Text>
            <Text>{item.question_name}</Text>
          </View>

        </View>
        <View style={styles.joinView}>
          <TouchableOpacity
            onPress={() => {
              startMeeting(item.student_id);
              // navigation.navigate('TeacherVideoCallWaiting', { MeetingId: item.id, ChannelName: item.channel_name, StudentId: item.student_id })
            }}>
            <Text style={{color: 'white', fontSize: 18}}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View>
  <TouchableOpacity>
    <Text>View</Text>
  </TouchableOpacity>
</View>  */}
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backBtn}
            source={require('../../../images/BackBtn.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTxt}>Meeting</Text>
      </View>

      <FlatList
        style={styles.ViewCamp}
        contentContainerStyle={{paddingBottom: moderateScale(50)}}
        data={sortedData.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Meeting available.</Text>
        }
        refreshing={loading}
      />
    </View>
  );
};

export default TeacherMeeting;

const styles = StyleSheet.create({
  header: {
    width: horizontalScale(360),
    height: verticalScale(50),
    backgroundColor: 'lightgray',
    // justifyContent:'space-around',
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
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(10),
    marginTop: moderateScale(20),
  },
  itemContainer: {
    width:horizontalScale(330),
    // height: verticalScale(50),
    backgroundColor: 'white',
    marginBottom: moderateScale(15),
    borderRadius: moderateScale(8),
    justifyContent: 'space-between',
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf: 'center',
    elevation: 10,
    padding: moderateScale(20),
  },
  joinView: {
    width: horizontalScale(55),
    height: verticalScale(35),
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'flex-start',
    marginTop: moderateScale(50),
    borderRadius: 10,
    marginLeft:moderateScale(-50)
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});
