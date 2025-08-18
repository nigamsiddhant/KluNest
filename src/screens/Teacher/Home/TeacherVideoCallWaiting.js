import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, TEACHER_JOIN_VIDEO_CALL } from '../../../constant/StringAPI';

const TeacherVideoCallWaiting = ({ navigation, route }) => {
  const { MeetingId, ChannelName, StudentId } = route.params;

  const [loading, setLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [videoCallData, setVideoCallData] = useState(null);

  useEffect(() => {
    TeacherVideoCallWaitingApi();

    const timer = setTimeout(() => {
      setIsWaiting(false); 
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  const TeacherVideoCallWaitingApi = async () => {
    console.log("TeacherVideoCallWaitingApi.......");

    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');

      console.log(TeacherId);
      console.log(TeacherToken);

      const response = await axios.post(
        `${BASE_URL}${TEACHER_JOIN_VIDEO_CALL}`,
        {
          teacher_id: TeacherId, 
          student_id: StudentId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        }
      );

      console.log("Response status...", response.status);
      if (response.status === 200) {
        console.log("Response data...", response.data);
        console.log("Agora token:", response.data.data.agora_token);
        console.log("Channel name:", response.data.data.channel_name);

        // Store the response data for navigation
        setVideoCallData({
          agoraToken: response.data.data.agora_token,
          channelName: response.data.data.channel_name,
          studentId: response.data.data.student_id,
          teacherId: TeacherId,  // Store TeacherId here
          meetingId : MeetingId
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to TeacherVideoCall screen when student joins (or based on condition)
  useEffect(() => {
    if (!isWaiting && videoCallData) {
      // Trigger navigation when student joins the call
      navigation.replace('TeacherVideoCall', {
        agoraToken: videoCallData.agoraToken,
        channelName: videoCallData.channelName,
        studentId: videoCallData.studentId,
        teacherId: videoCallData.teacherId, // Pass TeacherId along with other data
        meetingId: videoCallData.meetingId
      });
    }
  }, [isWaiting, videoCallData, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teacher Video Call Waiting</Text>
      <Text style={styles.infoText}>Meeting ID: {MeetingId}</Text>
      <Text style={styles.infoText}>Channel Name: {ChannelName}</Text>

      {isWaiting ? (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Waiting for student to join...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <Text style={styles.waitingText}>Student has joined the call!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  waitingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#888',
  },
});

export default TeacherVideoCallWaiting;
