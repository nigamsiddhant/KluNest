import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';
import socketService from '../../services/SocketService';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params || {};
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!userData) {
      // If no userData, navigate back to join room
      navigation.goBack();
      return;
    }

    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [userData, navigation]);

  const setupSocketListeners = () => {
    socketService.connect();

    socketService.onConnectionStatus((connected) => {
      setIsConnected(connected);
      if (connected && userData) {
        joinRoom();
      }
    });

    // If already connected, join the room immediately
    if (socketService.getConnectionStatus() && userData) {
      setIsConnected(true);
      joinRoom();
    }

    socketService.onMessage((message) => {
      const formattedMessage = {
        id: message.timestamp || Date.now().toString(),
        text: message.content,
        isUser: message.username === userData?.username,
        username: message.username,
        userType: message.userType,
        timestamp: new Date(message.timestamp).toLocaleTimeString(),
        type: message.type,
        file: message.file
      };
      setMessages(prev => [...prev, formattedMessage]);
    });

    socketService.onChatHistory((historyMessages) => {
      const formattedHistory = historyMessages.map(message => ({
        id: message.timestamp || Date.now().toString(),
        text: message.content,
        isUser: message.username === userData?.username,
        username: message.username,
        userType: message.userType,
        timestamp: new Date(message.timestamp).toLocaleTimeString(),
        type: message.type,
        file: message.file
      }));
      setMessages(formattedHistory);
    });

    socketService.onUserTyping((data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.username), data.username]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.username));
      }
    });

    socketService.onChatCleared(() => {
      setMessages([]);
      Alert.alert('Chat Cleared', 'Chat history has been cleared.');
    });
  };

  const joinRoom = () => {
    if (userData) {
      setIsJoiningRoom(true);
      try {
        socketService.joinRoom(userData);
        console.log('Successfully joined room with userData:', userData);
      } catch (error) {
        console.error('Failed to join room:', error);
        Alert.alert('Connection Error', 'Failed to join chat room. Please try again.');
      } finally {
        setIsJoiningRoom(false);
      }
    }
  };

  const handleImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: false,
      });

      const fileData = {
        uri: image.path,
        type: image.mime,
        name: image.filename || `image_${Date.now()}.jpg`,
      };

      setAttachedFile(fileData);
      setShowAttachmentOptions(false);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Image picker error:', error);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const handleVideoPicker = async () => {
    try {
      const video = await ImagePicker.openPicker({
        mediaType: 'video',
      });

      const fileData = {
        uri: video.path,
        type: video.mime,
        name: video.filename || `video_${Date.now()}.mp4`,
      };

      setAttachedFile(fileData);
      setShowAttachmentOptions(false);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Video picker error:', error);
        Alert.alert('Error', 'Failed to pick video');
      }
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const fileData = {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      };

      setAttachedFile(fileData);
      setShowAttachmentOptions(false);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Document picker error:', error);
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
  };

  const sendMessage = async () => {
    if ((!inputText.trim() && !attachedFile) || !isConnected) {
      return;
    }

    try {
      let fileInfo = null;

      // Upload file if attached
      if (attachedFile) {
        setIsUploading(true);
        try {
          fileInfo = await socketService.uploadFile(attachedFile);
          console.log('File uploaded successfully:', fileInfo);
        } catch (error) {
          Alert.alert('Upload Failed', 'Failed to upload file. Please try again.');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Send message with or without file
      const messageText = inputText.trim() || (fileInfo ? '' : '');
      socketService.sendMessage(messageText, fileInfo);

      setInputText('');
      setAttachedFile(null);

      // Stop typing indicator
      socketService.sendTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setIsUploading(false);
    }
  };

  const handleTyping = (text) => {
    setInputText(text);

    if (isConnected) {
      socketService.sendTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTyping(false);
      }, 1000);
    }
  };

  const renderFileAttachment = (file, isUser) => {
    if (!file) return null;

    const serverUrl = 'http://103.87.173.134:3009';
    const fileUrl = file.url ? `${serverUrl}${file.url}` : file.path;

    // Check if it's an image
    if (file.mimetype?.startsWith('image/')) {
      return (
        <TouchableOpacity
          onPress={() => setSelectedMedia({ type: 'image', uri: fileUrl })}>
          <Image
            source={{ uri: fileUrl }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    // Check if it's a video
    if (file.mimetype?.startsWith('video/')) {
      return (
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={() => setSelectedMedia({ type: 'video', uri: fileUrl })}>
          <View style={styles.videoPlaceholder}>
            <Icon name="play-circle-outline" size={moderateScale(50)} color={isUser ? '#fff' : '#1ABC9C'} />
            <Text style={[styles.videoText, isUser ? styles.userMessageText : styles.otherMessageText]}>
              Play Video
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Other files (documents, etc.)
    return (
      <View style={styles.fileAttachment}>
        <Icon name="insert-drive-file" size={moderateScale(24)} color={isUser ? '#fff' : '#1ABC9C'} />
        <Text style={[styles.fileName, isUser ? styles.userMessageText : styles.otherMessageText]} numberOfLines={1}>
          {file.originalName || file.filename || 'File'}
        </Text>
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    const isSystemMessage = item.type === 'system';

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessage : styles.otherMessage,
        ]}>
        {!item.isUser && (
          <View style={styles.messageHeader}>
            <Text style={styles.usernameText}>{item.username}</Text>
            {item.userType && (
              <Text style={[styles.userTypeText,
              item.userType === 'teacher' ? styles.teacherBadge : styles.studentBadge]}>
                {item.userType}
              </Text>
            )}
          </View>
        )}
        {item.file && renderFileAttachment(item.file, item.isUser)}
        {item.text && (
          <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
        )}
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={moderateScale(24)} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headingTxt}>
              {userData?.grade} {userData?.subject} Chat
            </Text>
            <View style={styles.connectionStatus}>
              <View style={[styles.statusDot, isConnected ? styles.connectedDot : styles.disconnectedDot]} />
              <Text style={styles.statusText}>
                {isJoiningRoom ? 'Joining...' : (isConnected ? 'Connected' : 'Connecting...')}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {typingUsers.length > 0 && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </Text>
        </View>
      )}

      {attachedFile && (
        <View style={styles.attachmentPreviewContainer}>
          <View style={styles.attachmentPreview}>
            <Icon name="attach-file" size={moderateScale(20)} color="#1ABC9C" />
            <Text style={styles.attachmentName} numberOfLines={1}>
              {attachedFile.name}
            </Text>
            <TouchableOpacity onPress={removeAttachment} style={styles.removeAttachment}>
              <Icon name="close" size={moderateScale(20)} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => setShowAttachmentOptions(true)}
          disabled={!isConnected || isUploading}>
          <Icon name="add-circle-outline" size={moderateScale(28)} color={isConnected ? '#1ABC9C' : '#999'} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          editable={isConnected && !isUploading}
        />

        <TouchableOpacity
          style={[styles.sendButton, ((!inputText.trim() && !attachedFile) || !isConnected || isUploading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={(!inputText.trim() && !attachedFile) || !isConnected || isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#1ABC9C" />
          ) : (
            <Icon
              name="send"
              size={moderateScale(20)}
              color={((inputText.trim() || attachedFile) && isConnected) ? '#1ABC9C' : '#999'}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Attachment Options Modal */}
      <Modal
        visible={showAttachmentOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAttachmentOptions(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAttachmentOptions(false)}>
          <View style={styles.attachmentOptionsContainer}>
            <TouchableOpacity style={styles.attachmentOption} onPress={handleImagePicker}>
              <Icon name="image" size={moderateScale(30)} color="#1ABC9C" />
              <Text style={styles.attachmentOptionText}>Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={handleVideoPicker}>
              <Icon name="videocam" size={moderateScale(30)} color="#1ABC9C" />
              <Text style={styles.attachmentOptionText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={handleDocumentPicker}>
              <Icon name="insert-drive-file" size={moderateScale(30)} color="#1ABC9C" />
              <Text style={styles.attachmentOptionText}>Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Media Viewer Modal */}
      <Modal
        visible={selectedMedia !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMedia(null)}>
        <View style={styles.mediaViewerContainer}>
          <TouchableOpacity
            style={styles.closeMediaButton}
            onPress={() => setSelectedMedia(null)}>
            <Icon name="close" size={moderateScale(30)} color="white" />
          </TouchableOpacity>

          {selectedMedia?.type === 'image' && (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}

          {selectedMedia?.type === 'video' && (
            <Video
              source={{ uri: selectedMedia.uri }}
              style={styles.fullScreenVideo}
              controls
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header styles
  heading: {
    width: horizontalScale(360),
    height: verticalScale(80),
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: moderateScale(8),
  },
  headerContent: {
    alignItems: 'center',
  },
  headingTxt: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: verticalScale(5),
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: horizontalScale(5),
  },
  connectedDot: {
    backgroundColor: '#4CAF50',
  },
  disconnectedDot: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: moderateScale(12),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Message styles
  messagesContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(15),
  },
  messagesContent: {
    paddingVertical: verticalScale(10),
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: verticalScale(5),
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1ABC9C',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  systemMessageContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: verticalScale(5),
    padding: moderateScale(8),
    borderRadius: moderateScale(15),
    maxWidth: '70%',
  },
  systemMessageText: {
    fontSize: moderateScale(12),
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  usernameText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#263755',
    marginRight: horizontalScale(8),
  },
  userTypeText: {
    fontSize: moderateScale(10),
    paddingHorizontal: horizontalScale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  teacherBadge: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  studentBadge: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  messageText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18),
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: moderateScale(10),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: verticalScale(4),
  },
  // Typing indicator
  typingContainer: {
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(5),
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  typingText: {
    fontSize: moderateScale(12),
    color: '#666',
    fontStyle: 'italic',
  },
  // Input styles
  inputContainer: {
    flexDirection: 'row',
    padding: horizontalScale(15),
    backgroundColor: 'white',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(5),
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(14),
    maxHeight: verticalScale(100),
    marginRight: horizontalScale(10),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(26, 188, 156, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(153, 153, 153, 0.1)',
  },
  // Attachment preview styles
  attachmentPreviewContainer: {
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(8),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
  },
  attachmentName: {
    flex: 1,
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(13),
    color: '#333',
  },
  removeAttachment: {
    padding: moderateScale(4),
  },
  // Message media styles
  messageImage: {
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(5),
  },
  videoContainer: {
    marginBottom: verticalScale(5),
  },
  videoPlaceholder: {
    width: moderateScale(200),
    height: moderateScale(150),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(12),
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(8),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(5),
  },
  fileName: {
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(13),
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    width: horizontalScale(280),
    alignItems: 'center',
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  attachmentOptionText: {
    marginLeft: horizontalScale(15),
    fontSize: moderateScale(16),
    color: '#333',
    fontWeight: '500',
  },
  mediaViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeMediaButton: {
    position: 'absolute',
    top: verticalScale(50),
    right: horizontalScale(20),
    zIndex: 1,
    padding: moderateScale(10),
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: verticalScale(300),
  },
});

export default ChatScreen;