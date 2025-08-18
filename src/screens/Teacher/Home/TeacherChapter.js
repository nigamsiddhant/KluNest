import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive'
import { THEME_COLOR2 } from '../../../utils/Colors'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { BASE_URL, TEACHER_CHAPTER } from '../../../constant/StringAPI'

const TeacherChapter = ({navigation, route}) => {
  const {classId, className, subjectId} = route.params;

  console.log('class', classId)
  console.log('className', className)
  console.log('subjectID..', subjectId)

  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState([]);
  const [classData, setClassData] = useState([])

  console.log(".......", chapterData)

  useEffect(() => {
    TeacherChapterApi();
  }, [])

  const TeacherChapterApi = async () => {
    console.log('Fetching Chapter...');
    setLoading(true); // Set loading to true when making the API request.
    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');

      const response = await axios.post(
        `${BASE_URL}${TEACHER_CHAPTER}`,
        {
          subject_id: subjectId,
          class_id: classId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        }
      );

      console.log('chapter Data....', response.data.chapters)
      setChapterData(response.data.chapters)

      // let classData = response.data

    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false); // Set loading to false once the API request is completed.
    }
  }

  const handleChapterPress = (chapter) => {
    // Navigate to the next screen and pass the chapter information
    navigation.navigate('TeacherChapterContain',{ chapterId: chapter.id, chapterTitle: chapter.name });
    // navigation.navigate('TeacherChapterContain');

  }

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.chapterItem} onPress={() => handleChapterPress(item)}>
      <Text style={styles.chapterTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex:1}}>

      <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../images/BackBtn.png')}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <Text style={styles.headTxt}>{className} Chapter</Text>
      </View>

      <View style={styles.chapterListContainer}>
        <FlatList
          data={chapterData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No chapters available.</Text>}
          refreshing={loading}
          onRefresh={TeacherChapterApi} // Refresh the data when pulling down.
        />
      </View>

    </View>
  )
}

export default TeacherChapter;

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
    marginLeft: moderateScale(80),
    color: THEME_COLOR2,
  },
  chapterListContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    marginTop:20,
    // backgroundColor:'white'
  },
  chapterItem: {
    // height:verticalScale(50),
    backgroundColor: 'white',
    padding: moderateScale(15),
    marginBottom: moderateScale(15),
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: '#ddd',
    elevation:10
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLOR2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
});
