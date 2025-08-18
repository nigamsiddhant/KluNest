//import liraries
import React, {Component, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  BackHandler,
  AppState,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, verticalScale} from '../components/responsive';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import SoundPlayer from 'react-native-sound-player';
import {
  ACCEPT_REJECT_API,
  BASE_URL,
  CHECK_VIDEO_CALL_STATUS,
  CREATE_TOKEN_API,
} from '../constant/StringAPI';

// create a component
const VideoCallingWaiting = ({navigation, route}) => {
  const {teacherId, videoCallId, channelName, channelToken} = route.params;

  const device = useCameraDevice('front');
  const {hasPermission} = useCameraPermission();

  useEffect(() => {
    getPermission();
  }, []);

  //play ringing sound
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let intervalId = null;

      console.log('use Focus effect has runned');

      if (isActive && intervalId === null) {
        console.log('hello world --------------------- hello world');
        SoundPlayer.playSoundFile('ringing', 'mp3');
        intervalId = setInterval(() => {
          SoundPlayer.playSoundFile('ringing', 'mp3');
        }, 15000);
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          SoundPlayer.stop();
        }
      };
    }, []),
  );

  //backhandler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        rejectCall();
        navigation.goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let timeoutId = null;
      timeoutId = setTimeout(() => {
          rejectCall();
          navigation.goBack();
      }, 1000 * 60);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      };
    }, []),
  );

  const rejectCall = async () => {
    try {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();

      formData.append('video_call_id', videoCallId);
      formData.append('status', 'rejected');

      console.log('rejectCall formData', formData);

      const response = await axios.post(
        `${BASE_URL}${ACCEPT_REJECT_API}`,
        formData,
        options,
      );

      console.log('accept-reject response', response?.data);
    } catch (e) {
      console.log('erro', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const checkCall = async () => {
        try {
          const response = await axios.post(
            `${BASE_URL}${CHECK_VIDEO_CALL_STATUS}`,
            {
              video_call_id: videoCallId,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          console.log('check call', response.data);

          if (response?.data?.status === 'success') {
            if (response.data.data.status === 'accepted') {
              createToken();
            }

            if (response?.data?.data?.status === 'rejected') {
              navigation.goBack();
            }
          }

          console.log('check video stautus response', response.data);
        } catch (e) {
          console.log('erro', e);
        }
      };

      let intervalId = null;
      if (isActive) {
        intervalId = setInterval(() => {
          checkCall();
        }, 5000);
      }

      checkCall();
      return () => {
        isActive = false;
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, []),
  );

  const createToken = async () => {
    try {
      const formData = new FormData();

      formData.append('uid', teacherId);
      formData.append('channel_name', channelName);

      const response = await axios.post(
        'http://68.183.92.60:8098/api/create-token',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response?.data?.code === 200) {
        navigation.replace('videoCalling', {
          videoCallId: videoCallId,
          channel: channelName,
          channelToken: channelToken,
          userId: Number(teacherId),
        });
      }
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'black'}}>
          Camera And Audio Permission Required
        </Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'black'}}>Cannot Access Mobile Camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[StyleSheet.absoluteFill, {zIndex: 1}]}
        device={device}
        isActive={true}
      />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
          paddingVertical: verticalScale(20),
        }}>
        <Text style={{color: 'white', fontSize: verticalScale(21)}}>
          Ringing...
        </Text>

        <TouchableOpacity
          onPress={() => {
            rejectCall();
            navigation.goBack();
          }}
          style={{
            backgroundColor: 'red',
            width: moderateScale(65),
            height: moderateScale(65),
            borderRadius: moderateScale(100),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="call-end" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};

//make this component available to the app
export default VideoCallingWaiting;
