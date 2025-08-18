import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, TEACHER_CONTAIN } from '../../../constant/StringAPI';
import { ScrollView } from 'react-native-gesture-handler';

const TeacherChapterContain = ({ navigation, route }) => {
  const { chapterId, chapterTitle } = route.params;

  const [loading, setLoading] = useState(false);
  const [containData, setContainData] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index

  useEffect(() => {
    FetchingContainApi();
  }, []);

  const FetchingContainApi = async () => {
    setLoading(true);
  
    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');
  
      if (!TeacherId || !TeacherToken) {
        console.log("TeacherId or TeacherToken is missing");
        return;
      }
  
      const response = await axios.post(
        `${BASE_URL}${TEACHER_CONTAIN}`,
        { chapter_id: chapterId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        }
      );
  
      console.log("response.data", response.data);
  
      if (response.data && response.data.content) {
        setContainData(response.data.content);
      } else {
        // Handle case where content is empty or not found
        console.log("No content found");
      }
    } catch (error) {
      // Handling 404 and other errors
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Content not found (404)");
          alert("Content not available");
        } else {
          console.log("Error fetching data:", error.response.data);
          alert("Error fetching data: " + error.response.data.message);
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        alert("No response received. Please check your network connection.");
      } else {
        console.log("Error setting up request:", error.message);
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const nextQuestion = () => {
    if (currentIndex < containData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = containData[currentIndex]; 

  const renderImage = (imageUrl) => {
    if (imageUrl) {
      const fullImageUrl = `${BASE_URL}${imageUrl}`;
      return (
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.questionImage}
        />
      );
    }
    return null;
  };

  const renderQuestionContent = () => {
    if (containData.length === 0) {
      return <Text style={styles.noQuestionText}>Question is not available.</Text>;
    }
  
    const currentImageUrl = containData[currentIndex]?.question_image;
  
    return (
      <>
      <View style={{paddingBottom:moderateScale(40)}}>
        <Text style={styles.questionText}>
          {containData[currentIndex]?.question}
        </Text>
        {currentImageUrl ? renderImage(currentImageUrl) : null}
        </View>
      </>
    );
  };
  

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../images/BackBtn.png')}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <Text style={styles.headTxt}>Content</Text>
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', height: verticalScale(50), backgroundColor: "#38588b" }}>
        <Text style={styles.Title}>{chapterTitle}</Text>
      </View>
      
      <View style={styles.countView}>
        <Text style={styles.navButtonText}> {currentIndex + 1} of {containData.length}</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {renderQuestionContent()}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={previousQuestion}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        {containData.length > 0 && currentIndex < containData.length - 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={nextQuestion}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TeacherChapterContain;

const styles = StyleSheet.create({
  heading: {
    width: horizontalScale(360),
    height: verticalScale(50),
    alignSelf: 'center',
    flexDirection: 'row',
    padding: moderateScale(12),
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
  },
  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
  },
  headTxt: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    marginLeft: moderateScale(110),
    color: THEME_COLOR2,
  },
  Title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  contentContainer: {
    padding: moderateScale(20),
    flex: 1,
    // backgroundColor:'red',
    // alignItems: 'center',
    //  paddingBottom:moderateScale(50)    
  },
  questionText: {
    fontSize: 18,
    color: THEME_COLOR2,
    textAlign: 'center',
  },
  questionImage: {
    width: horizontalScale(300),
    height: verticalScale(200),
    resizeMode: 'contain',
    marginBottom: verticalScale(20),
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(20),
  },
  navButton: {
    padding: moderateScale(10),
    backgroundColor: THEME_COLOR2,
    borderRadius: 5,
    margin: moderateScale(10),
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  countView: {
    width: horizontalScale(80),
    height: verticalScale(40),
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: moderateScale(20),
    borderRadius: 10,
  },
  noQuestionText: {
    fontSize: 16,
    color: THEME_COLOR2,
    textAlign: 'center',
  },
});
