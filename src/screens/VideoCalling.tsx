// Import React Hooks
import React, {useRef, useState, useEffect, useCallback} from 'react';
// Import user interface elements
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  BackHandler,
  AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// Import components related to obtaining Android device permissions
import {PermissionsAndroid, Platform} from 'react-native';
// Import Agora SDK
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
} from 'react-native-agora';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../components/responsive';
import {Dimensions} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Timer from '../components/Timer';
import Toast from 'react-native-simple-toast';
import {
  ACCEPT_REJECT_API,
  BASE_URL,
  CHECK_VIDEO_CALL_STATUS,
} from '../constant/StringAPI';

// Define basic information

const VideoCalling = ({navigation, route}: {navigation: any; route: any}) => {
  const {videoCallId, channel, channelToken, userId} = route.params;

  const agoraEngineRef = useRef<IRtcEngine>();
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const eventHandler = useRef<IRtcEngineEventHandler>();
  const [micOff, setMicOff] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const appId = '352672cef2544a5fa546225fa9669d10';
  const token = channelToken;
  const channelName = channel;
  const uid = userId;
  console.log('route params', route.params, 'type of userid', typeof userId);
  const timeoutIdRef = useRef(null)

  // backhandler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        leave();
        // rejectCall();
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

  useEffect(() => {
    if(remoteUid !== 0 && timeoutIdRef.current) {
     clearTimeout(timeoutIdRef.current)
    }
  },[remoteUid])

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const setupAndStart = async () => {
        await setupVideoSDKEngine();

        join();
      };

      setupAndStart();

      timeoutIdRef.current = setTimeout(() => {
        console.log('remotedId in timeout',remoteUid)
        if (remoteUid === 0) {
          leave();
          navigation.goBack();
        }
      }, 16000);

      return () => {
        agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
        agoraEngineRef.current?.release();
        isActive = false;
      };
    }, []),
  );

  // const checkCall = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}${CHECK_VIDEO_CALL_STATUS}`,
  //       {
  //         video_call_id: videoCallId,
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );

  //     if(response?.data?.status === 'success') {
  //       if(response.data.data.status === 'accepted') {

  //       }

  //     }
  //     // if (response?.data?.status === 'success') {
  //     //   leave();
  //     //   navigation.goBack();
  //     // }
  //   } catch (e) {
  //     console.log('erro', e);
  //   }
  // };

  // Define the setupVideoSDKEngine method called when the App starts
  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after obtaining device permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: () => {
          console.log('Successfully joined channel: ' + channel);
          setIsJoined(true);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          console.log('Remote user ' + uid + ' joined');
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          console.log('Remote user ' + uid + ' left the channel');
          setRemoteUid(0);
          leave()
          navigation.goBack()
        },
      };

      // Register the event handler
      agoraEngine.registerEventHandler(eventHandler.current);
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
      // Enable local video
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };

  // Define the join method called after clicking the join channel button
  const join = async () => {
    if (isJoined) {
      console.log('already join');
      return;
    }

    try {
      console.log('join params', token, channelName, uid);
      // Start preview
      agoraEngineRef.current?.startPreview();
      // Join the channel as a broadcaster
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        // Set channel profile to live broadcast
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        // Set user role to broadcaster
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        // Publish audio collected by the microphone
        publishMicrophoneTrack: true,
        // Publish video collected by the camera
        publishCameraTrack: true,
        // Automatically subscribe to all audio streams
        autoSubscribeAudio: true,
        // Automatically subscribe to all video streams
        autoSubscribeVideo: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    if (isJoined) {
      try {
        agoraEngineRef.current?.leaveChannel();
        setRemoteUid(0);
        setIsJoined(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // const rejectCall = async () => {
  //   try {
  //     const options = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     };

  //     const formData = new FormData();

  //     formData.append('video_call_id', videoCallId);
  //     formData.append('status', 'rejected');

  //     console.log('rejectCall formData', formData);

  //     const response = await axios.post(
  //       `${BASE_URL}${ACCEPT_REJECT_API}`,
  //       formData,
  //       options,
  //     );

  //     console.log('reject the call response ===========>', response?.data);
  //   } catch (e) {
  //     console.log('erro', e);
  //   }
  // };

  const onMicButtonClicked = () => {
    if (micOff) {
      setMicOff(false);
      agoraEngineRef.current?.muteLocalAudioStream(false);
    } else {
      setMicOff(true);
      agoraEngineRef.current?.muteLocalAudioStream(true);
    }
  };

  const onSpeakerButtonClicked = () => {
    if (speakerOff) {
      setSpeakerOff(false);
      agoraEngineRef.current?.muteRemoteAudioStream(remoteUid, false);
    } else {
      setSpeakerOff(true);
      agoraEngineRef.current?.muteRemoteAudioStream(remoteUid, true);
    }
  };

  const onVideoButtonClicked = () => {
    if (videoOff) {
      setVideoOff(false);
      agoraEngineRef.current?.muteLocalVideoStream(false);
    } else {
      setVideoOff(true);
      agoraEngineRef.current?.muteLocalVideoStream(true);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.videoContainer}>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={onVideoButtonClicked} style={[styles.btn]}>
            {videoOff ? (
              <Icon
                name="videocam-off"
                size={horizontalScale(22)}
                color="#fff"
              />
            ) : (
              <Icon name="videocam" size={horizontalScale(22)} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSpeakerButtonClicked}
            style={[styles.btn]}>
            {speakerOff ? (
              <Icon name="volume-off" size={horizontalScale(22)} color="#fff" />
            ) : (
              <Icon name="volume-up" size={horizontalScale(22)} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onMicButtonClicked} style={[styles.btn]}>
            {micOff ? (
              <Icon name="mic-off" size={horizontalScale(22)} color="#fff" />
            ) : (
              <Icon name="mic" size={horizontalScale(22)} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              leave();
              // rejectCall();
              navigation.goBack();
            }}
            style={[styles.btn, {backgroundColor: '#d62b2b'}]}>
            <Icon name="call-end" size={horizontalScale(22)} color="#fff" />
          </TouchableOpacity>
        </View>
        {isJoined && remoteUid !== 0 ? (
          <Timer
            style={{
              position: 'absolute',
              top: verticalScale(20),
              alignSelf: 'center',
              zIndex: 20,
              color: 'white',
              fontSize: 16,
            }}
          />
        ) : null}
        {!videoOff && isJoined ? (
          <View
            style={{
              position: 'absolute',
              // left: horizontalScale(375 - 113),
              left: horizontalScale(15),
              top: verticalScale(15),
              zIndex: 2,
            }}
            key={0}>
            <RtcSurfaceView
              zOrderOnTop={true}
              canvas={{uid: 0}}
              style={{
                width: moderateScale(90),
                height: moderateScale(120),
                zIndex: 10,
              }}
            />
          </View>
        ) : null}
        {isJoined && remoteUid !== 0 ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {zIndex: 1, backgroundColor: 'gray'},
            ]}
            key={remoteUid}>
            <RtcSurfaceView
              zOrderMediaOverlay={false}
              canvas={{uid: remoteUid}}
              style={{height: '100%', width: '100%'}}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

// Define user interface styles
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  videoContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
    marginBottom: verticalScale(20),
    width: horizontalScale(350),
    paddingHorizontal: horizontalScale(15),
    backgroundColor: '#363535',
    paddingVertical: verticalScale(16),
    borderRadius: 15,
  },
  btn: {
    backgroundColor: '#4f4f4f',
    width: horizontalScale(50),
    height: horizontalScale(50),
    borderRadius: moderateScale(100),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', paddingHorizontal: 8, color: '#0000ff'},
});

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
};

export default VideoCalling;
