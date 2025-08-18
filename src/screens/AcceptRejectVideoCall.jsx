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
const AcceptRejectVideoCall = ({navigation, route}) => {
  const {studentId, videoCallId, channelName} = route.params;
  console.log('route.parms', route.params);

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

      if (isActive && intervalId === null) {
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

      console.log('reject the call response ===========>', response?.data);
    } catch (e) {
      console.log('erro', e);
    }
  };

  const acceptCall = async () => {
    console.log('acceptCallFunction has runned')
    try {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();

      formData.append('video_call_id', videoCallId);
      formData.append('status', 'accepted');

      console.log('accept call formData', formData);

      const response = await axios.post(
        `${BASE_URL}${ACCEPT_REJECT_API}`,
        formData,
        options,
      );

      console.log('accept call', response.data);

      if (response?.data?.status === 'success') {
        createToken();
      }
    } catch (e) {
      console.log('accetp call erro', e?.response);
    }
  };

  const createToken = async () => {
    const randomNumber = Math.floor(Math.random() * 100001)
    try {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data', // Content-Type for file uploads
        },
      };

      const formData = new FormData();

      formData.append('uid', Number(studentId) + randomNumber);
      formData.append('channel_name', channelName);

      console.log('formData create token',formData)

      const response = await axios.post(
        `${BASE_URL}${CREATE_TOKEN_API}`,
        formData,
        options,
      );

      console.log('crete token', response.data);

      if (response?.data?.code === 200) {
        const channelToken = response?.data?.agora_token
        navigation.replace('videoCalling', {
          videoCallId: videoCallId,
          channel: channelName,
          channelToken: channelToken,
          userId: Number(studentId) + randomNumber,
        });
      }

      console.log('response', response.data);
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

          if (
            response?.data?.status === 'success' &&
            response?.data?.data?.status === 'rejected'
          ) {
            navigation.goBack();
          }
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
          zIndex: 10,
          justifyContent: 'space-between',
          paddingVertical: verticalScale(10),
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: verticalScale(21)}}>
            Ringing...
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
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
              zIndex: 2,
            }}>
            <Icon name="call-end" size={moderateScale(30)} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => acceptCall()}
            style={{
              backgroundColor: 'green',
              width: moderateScale(65),
              height: moderateScale(65),
              borderRadius: moderateScale(100),
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}>
            <Icon name="videocam" size={moderateScale(30)} color="#fff" />
          </TouchableOpacity>
        </View>
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
export default AcceptRejectVideoCall;
