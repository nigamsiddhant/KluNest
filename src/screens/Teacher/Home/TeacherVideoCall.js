





// import { View, Text } from 'react-native'
// import React from 'react'

// const TeacherVideoCall = ({navigation, route}) => {
//   const { agoraToken, channelName, studentId , teacherId, meetingId } = route.params;

// console.log("video........>>>",route.params)


//   return (
//     <View>
//       <Text>TeacherVideoCall</Text>
//     </View>
//   )
// }

// export default TeacherVideoCall


























import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RtcEngine, VideoRenderMode } from 'react-native-agora';
import { agoraAppId } from '../../../constant/StringAPI'; // Replace with your Agora App ID

const TeacherVideoCall = ({ navigation, route }) => {
  const { agoraToken, channelName, studentId, teacherId, meetingId } = route.params;

  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(null); // Store remote user (student)

  useEffect(() => {
    // Initialize Agora engine
    const initAgora = async () => {
      const rtcEngine = await RtcEngine.create(agoraAppId); // Initialize Agora engine
      setEngine(rtcEngine);

      // Set up event listeners for Agora
      rtcEngine.addListener('userJoined', (uid, elapsed) => {
        console.log('User joined: ', uid);
        setRemoteUid(uid); // Set the student's UID when they join
      });

      rtcEngine.addListener('userOffline', (uid, reason) => {
        console.log('User offline: ', uid);
        setRemoteUid(null); // Reset when the student leaves the call
      });

      rtcEngine.addListener('joinChannelSuccess', (channel, uid, elapsed) => {
        console.log(`Successfully joined channel: ${channel} with uid: ${uid}`);
        setJoined(true); // Teacher has joined the channel
      });

      // Join the Agora channel (using teacher's credentials)
      await rtcEngine.joinChannel(agoraToken, channelName, null, teacherId);

      // Enable video for the teacher
      rtcEngine.enableVideo();
    };

    initAgora();

    // Cleanup when the component is unmounted
    return () => {
      if (engine) {
        engine.destroy();
      }
    };
  }, []);

  // Leave the channel and clean up
  const leaveChannel = async () => {
    if (engine) {
      await engine.leaveChannel();
      setJoined(false);
      setRemoteUid(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teacher Video Call</Text>

      {/* Local video (Teacher's video feed) */}
      {joined && (
        <View style={styles.localVideoContainer}>
          <RtcEngine.VideoCanvas
            uid={teacherId}
            style={styles.localVideo}
            renderMode={VideoRenderMode.HIDDEN}
          />
        </View>
      )}

      {/* Remote video (Student's video feed) */}
      {remoteUid && (
        <View style={styles.remoteVideoContainer}>
          <RtcEngine.VideoCanvas
            uid={remoteUid}
            style={styles.remoteVideo}
            renderMode={VideoRenderMode.HIDDEN}
          />
        </View>
      )}

      {/* Button to leave the call */}
      <View style={styles.buttonContainer}>
        <Button title="End Call" onPress={leaveChannel} />
      </View>
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
  localVideoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
    marginBottom: 20,
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  remoteVideoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default TeacherVideoCall;
