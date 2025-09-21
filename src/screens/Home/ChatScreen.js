import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
        <Text style={styles.headingTxt}>Chat Support</Text>
      </LinearGradient>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}>
          <Icon
            name="send"
            size={moderateScale(20)}
            color={inputText.trim() ? '#1ABC9C' : '#999'}
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
  heading: {
    width: horizontalScale(360),
    height: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
    marginTop: moderateScale(10),
    marginLeft: moderateScale(10),
  },
  headingTxt: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    color: 'white',
  },
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
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: moderateScale(14),
    color: 'white',
    lineHeight: moderateScale(18),
  },
  timestamp: {
    fontSize: moderateScale(10),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: verticalScale(4),
  },
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