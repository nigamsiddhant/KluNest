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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';
import socketService from '../../services/SocketService';
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params || {};
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
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
        type: message.type
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
        type: message.type
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

  const sendMessage = () => {
    if (inputText.trim() && isConnected) {
      socketService.sendMessage(inputText.trim());
      setInputText('');

      // Stop typing indicator
      socketService.sendTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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
        <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.otherMessageText]}>
          {item.text}
        </Text>
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          editable={isConnected}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || !isConnected) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || !isConnected}>
          <Icon
            name="send"
            size={moderateScale(20)}
            color={(inputText.trim() && isConnected) ? '#1ABC9C' : '#999'}
          />
        </TouchableOpacity>
      </View>
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
});

export default ChatScreen;