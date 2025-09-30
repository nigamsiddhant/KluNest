import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../components/responsive';

const JoinRoom = () => {
  const navigation = useNavigation();
  const [userForm, setUserForm] = useState({
    username: '',
    userType: 'student',
    grade: '10',
    subject: 'mathematics'
  });

  const joinRoom = () => {
    if (!userForm.username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    const userData = {
      username: userForm.username,
      userType: userForm.userType,
      grade: userForm.grade,
      subject: userForm.subject,
      user_id: Math.random().toString(36).substring(2, 15)
    };

    navigation.navigate('ChatScreen', { userData });
  };

  return (
    <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join Chat Room</Text>

        <TextInput
          style={styles.input}
          value={userForm.username}
          onChangeText={(text) => setUserForm({ ...userForm, username: text })}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>User Type:</Text>
          <View style={styles.pickerRow}>
            <TouchableOpacity
              style={[styles.pickerButton, userForm.userType === 'student' && styles.pickerButtonSelected]}
              onPress={() => setUserForm({ ...userForm, userType: 'student' })}
            >
              <Text style={[styles.pickerButtonText, userForm.userType === 'student' && styles.pickerButtonTextSelected]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerButton, userForm.userType === 'teacher' && styles.pickerButtonSelected]}
              onPress={() => setUserForm({ ...userForm, userType: 'teacher' })}
            >
              <Text style={[styles.pickerButtonText, userForm.userType === 'teacher' && styles.pickerButtonTextSelected]}>Teacher</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Grade:</Text>
          <View style={styles.pickerRow}>
            {['9', '10', '11', '12'].map(grade => (
              <TouchableOpacity
                key={grade}
                style={[styles.pickerButton, userForm.grade === grade && styles.pickerButtonSelected]}
                onPress={() => setUserForm({ ...userForm, grade })}
              >
                <Text style={[styles.pickerButtonText, userForm.grade === grade && styles.pickerButtonTextSelected]}>{grade}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Subject:</Text>
          <View style={styles.pickerRow}>
            {['mathematics', 'Science', 'English', 'History'].map(subject => (
              <TouchableOpacity
                key={subject}
                style={[styles.pickerButton, userForm.subject === subject && styles.pickerButtonSelected]}
                onPress={() => setUserForm({ ...userForm, subject })}
              >
                <Text style={[styles.pickerButtonText, userForm.subject === subject && styles.pickerButtonTextSelected]}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.joinButton} onPress={joinRoom}>
          <Text style={styles.joinButtonText}>Join Room</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: verticalScale(30),
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    marginBottom: verticalScale(20),
  },
  pickerContainer: {
    width: '100%',
    marginBottom: verticalScale(20),
  },
  pickerLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: 'white',
    marginBottom: verticalScale(10),
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(5),
    minWidth: '22%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pickerButtonSelected: {
    backgroundColor: 'white',
  },
  pickerButtonText: {
    fontSize: moderateScale(14),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pickerButtonTextSelected: {
    color: '#263755',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: 'white',
    paddingHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(25),
    marginTop: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  joinButtonText: {
    color: '#263755',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
});

export default JoinRoom;