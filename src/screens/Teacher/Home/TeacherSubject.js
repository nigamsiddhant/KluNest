import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { THEME_COLOR2 } from '../../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, TEACHER_CLASSES } from '../../../constant/StringAPI';

const TeacherSubject = ({ navigation, route }) => {
  const { SubjectId, name } = route.params;

  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const[subjecID, setSubjectID] = useState();

  useEffect(() => {
    TeacherClassApi();
  }, []);

  // Fetch class data from API
  const TeacherClassApi = async () => {
    setLoading(true);
    console.log('Fetching classes...');

    try {
      const TeacherId = await AsyncStorage.getItem('TeacherId');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');

      console.log('TeacherId:', TeacherId);
      console.log('TeacherToken:', TeacherToken);

      const response = await axios.post(
        `${BASE_URL}${TEACHER_CLASSES}`,
        {
          subject_id: SubjectId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TeacherToken}`,
          },
        }
      );

      console.log('Class data:', response.data);

      if (response.data.code === 200) {
        console.log("subjectID....",response.data.subject_id)
        setClassData(response.data.classes);
        let subjectID = response.data.subject_id;
        setSubjectID(subjectID);

      }
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} 
      onPress={() =>navigation.navigate('TeacherChapter',{classId: item.class_id, className: item.class_name,subjectId:subjecID })}
    >
      {/* <Text style={styles.subjectName}>{item.class_id}</Text> */}
      <Text style={styles.subjectName}>{item.class_name}</Text>
      

    </TouchableOpacity>
  );
   
  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../images/BackBtn.png')}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <Text style={styles.headTxt}>{name} Classes</Text>
      </View>

 
      <FlatList
        style={styles.viewComp}
        data={classData}
        renderItem={renderItem}
        keyExtractor={item => item.class_id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No classes available.</Text>}
        refreshing={loading}
      />
    </View>
  );
};

export default TeacherSubject;

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
  itemContainer: {
    width: horizontalScale(300),
    // height: verticalScale(50),
    backgroundColor: 'white',
    marginBottom: moderateScale(15),
    borderRadius: moderateScale(8),
    justifyContent: 'space-between',
    flexDirection:'row',  
    alignItems: 'center',
    alignSelf:'center',
    elevation:10,
    padding:moderateScale(16)
  },
  subjectName: {
    color: THEME_COLOR2,
    fontSize: 16,
    fontWeight: '600',
  },
  viewComp: {
    flex: 1,
    padding: moderateScale(20),
    marginTop: moderateScale(20),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});
