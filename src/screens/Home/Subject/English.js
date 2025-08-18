// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useNavigation } from '@react-navigation/native'
// import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
// import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { BASE_URL, SUBJECT_CHAPTERS } from '../../../constant/StringAPI';
// import { FlatList } from 'react-native-gesture-handler';

// const English = ({ navigation, route }) => {
//   const { id, name } = route.params;
//   const [chaptersData, setChaptersData] = useState('');
//   const [loading, setLoding] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [studentChapterId, setStudentChapterId] = useState([])

//   useEffect(() => {
//     SubjectDataApi();
//   }, []);

//   const SubjectDataApi = async () => {
//     console.log('subject Api........');
//     setLoding(true);
//     try {
//       const UserDataID = await AsyncStorage.getItem('UserDataID');
//       const UserToken = await AsyncStorage.getItem('UserToken');
//       const UserClassID = await AsyncStorage.getItem('UserClassID');
      
//       console.log('>>>>>>>>', UserDataID);
//       console.log(UserToken);
//       console.log(UserClassID);
  
//       const response = await axios.post(`${BASE_URL}${SUBJECT_CHAPTERS}`, {
//         subject_id: id,
//         class_id: UserClassID,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${UserToken}`,
//         }
//       });
  
//       console.log('Api response chapters', response.data);
  
//       if (response?.data?.status === 'success') {
//         const chapters = response.data.chapters || [];
        
       
//         if (chapters.length > 1 && chapters[1]?.id) {
//           let studentChaptId = chapters[1].id;
//           setStudentChapterId(studentChaptId);
//           console.log('Student Chapter ID:', studentChaptId);
//         } else {
          
//           console.log('No data available for chapter 1');
//           setStudentChapterId(null); 
//           // Alert.alert('No Data', 'Chapter 1 data is not available.');
//         }
  
//         setChaptersData(chapters); 
//       } else {
//         console.error('Failed to fetch chapters:', response?.data?.message || 'Unknown error');
//         Alert.alert('Error', 'Failed to load chapters. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error fetching data', error.message || error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     } finally {
//       setLoding(false);
//     }
//   };
  

//   const Chapter = ({ navigation, item, index }) => {
//     const handleChapterClick = (item, index) => {
//       if (index >= 1) { // Check if it's the second chapter (index = 1)
//         Alert.alert(
//           'Proceed to Payment',
//           'You need to complete the payment before accessing this chapter.',
//           [
//             {
//               text: 'Yes',
//               onPress: () => {
//                 navigation.navigate('StudentPayment');
//               },
//             },
//             {
//               text:'No',
//               onPress: () =>{
//                 console.log('payment canceled')
//               }
//             }
//           ],
//           { cancelable: false }
//         );
//       } else {
//         navigation.navigate('Quiz', { id: item.id, name: item.name , studentChaptId:studentChapterId});
//       }
//     };
  
//     return (
//       <View style={{ flex: 1 }}>
//       <View>
//         <TouchableOpacity
//           onPress={() => handleChapterClick(item, index)}
//           style={styles.viewChapter}
//         >
//           <View style={{ width: '75%' }}>
//             <Text style={{ fontSize: 20, margin: 1, color: 'black' }}>
//               {item.name}
//             </Text>
//           </View>
  
//           {index >= 1 ? ( // For the second chapter (locked)
//             <View style={styles.lockedContainer}>
//               {/* <Image
//                 source={require('../../../images/lockIcon.png')} // Add your lock icon here
//                 style={styles.lockIcon}
//               /> */}
//               <Text style={{ fontSize: 16, color: 'black' }}>Locked</Text>
//             </View>
//           ) : (
//             <LinearGradient
//               colors={[THEME_COLOR, THEME_COLOR2]}
//               style={styles.openBtn}
//             >
//               <Text style={{ fontSize: 16, color: 'white' }}>Open</Text>
//             </LinearGradient>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.heading}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
//         </TouchableOpacity>
//         <Text style={styles.scienceTxt}>{name} Chapters</Text>
//       </View>

//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 30 }}>
//         <Text style={styles.ChapterTxt}>Chapters</Text>
     
//       </View>

//       <View>
//         {console.log(chaptersData)}

//         <FlatList
//           data={chaptersData}
//           keyExtractor={item => item.id.toString()}
//           renderItem={({ item, index }) => <Chapter navigation={navigation} item={item} index={index} />}
//           ListEmptyComponent={<Text>No data available</Text>}
//           contentContainerStyle={{ padding: 1 }}
//         />
//       </View>
//     </View>
//   );
// }



// export default English;
// const styles =StyleSheet.create({
//   container:{
//     flex:1,
//     backgroundColor:'white'
//   },

//   heading:{
//     width:horizontalScale(360),
//     height:verticalScale(50),
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding:moderateScale(12),
//     backgroundColor: '#E9E9E9',
//     text:'center',
  
    
// },

// backBtn:{
//     width:horizontalScale(25),
//     height:verticalScale(20),
//     resizeMode:'contain',
//     marginTop:moderateScale(10)
    
// },
// scienceTxt:{
//     fontSize:22,
//     fontWeight:'700',
//     alignSelf:'center',
//     marginLeft:moderateScale(70),
//     color:THEME_COLOR2,
    
// },

// ChapterTxt:{
//   fontSize:22,
//   fontWeight:'700',
//   color:THEME_COLOR2,
// },

// viewChapter:{
//   width:horizontalScale(330),
//   // height:verticalScale(50),
//   backgroundColor:'#FFFFFF',
//   borderRadius:moderateScale(15),
//   flexDirection:'row',
//   padding:15,
//   margin:10,
//   justifyContent:'space-around',
//   alignItems:'center',
//   alignSelf:'center',
//   elevation:5
  



// },
// openBtn:{
//   width:horizontalScale(70),
//   height:verticalScale(30),
//   backgroundColor:THEME_COLOR,
//   justifyContent:'center',
//   alignItems:'center',
//   borderRadius:20,
//   elevation:10
// },



// })





























import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, STUDENT_SUBSCRIPTION, SUBJECT_CHAPTERS } from '../../../constant/StringAPI';
import { FlatList } from 'react-native-gesture-handler';

const English = ({ navigation, route }) => {
  const { id, name } = route.params;
  console.log("English head page...", route.params);
  const [chaptersData, setChaptersData] = useState([]);
  const [loading, setLoding] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false); // State to store payment status
  const [studentChapterId, setStudentChapterId] = useState([]);

  useEffect(() => {
    SubjectDataApi();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      SubscriptionAPi();
    }, [])
  );

  const SubscriptionAPi = async () => {
    setLoding(true);
    const UserDataID = await AsyncStorage.getItem('UserDataID');
    try {
      const response = await axios.get(`${BASE_URL}${STUDENT_SUBSCRIPTION}${UserDataID}`);
      console.log("subscription plan >>>>> ", response.data);
      
       if(response.data.code === 200){
      const paymentStatus = response.data.data.status || false; // Assuming payment status is in the response
      setPaymentStatus(paymentStatus); // Set payment status to state
       }
       else if(response.data.code === 404){
        Alert.alert('Subscription', "Please Purches all the Chapter ");
       }

    } catch (error) {
      console.error("Error fetching data", error.message || error);
      // Alert.alert('Error', "Something went wrong. Please try again.");
    } finally {
      setLoding(false);
    }
  };

  const SubjectDataApi = async () => {
    console.log('subject Api........');
    setLoding(true);
    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const UserToken = await AsyncStorage.getItem('UserToken');
      const UserClassID = await AsyncStorage.getItem('UserClassID');

      console.log('>>>>>>>>', UserDataID);
      console.log(UserToken);
      console.log(UserClassID);

      const response = await axios.post(`${BASE_URL}${SUBJECT_CHAPTERS}`, {
        subject_id: id,
        class_id: UserClassID,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${UserToken}`,
        }
      });

      console.log('Api response chapters', response.data);
      console.log('Api response chapters', response.data.chapters);

      if (response?.data?.status === 'success') {
        const chapters = response.data.chapters || [];
        setChaptersData(chapters);
        if (chapters.length > 1 && chapters[0]?.id) {
          let studentChaptId = chapters[0].id;
          setStudentChapterId(studentChaptId);
          console.log('Student Chapter ID:', studentChaptId);
        } else {
          setStudentChapterId(null);
        }
      } else {
        console.error('Failed to fetch chapters:', response?.data?.message || 'Unknown error');
        Alert.alert('Error', 'Failed to load chapters. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching data', error.message || error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoding(false);
    }
  };

  const Chapter = ({ navigation, item, index }) => {
    const handleChapterClick = (item, index) => {
      if (!paymentStatus && index >= 1) { // Check if payment is not done and it's the second or later chapter
        Alert.alert(
          'Proceed to Payment',
          'You need to complete the payment before accessing this chapter.',
          [
            {
              text: 'Yes',
              onPress: () => {
                navigation.navigate('StudentPayment');
              },
            },
            {
              text: 'No',
              onPress: () => {
                console.log('Payment canceled');
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        navigation.navigate('Quiz', { id: item.id, name: item.name, studentChaptId: studentChapterId, subjectId: route.params.id });
        console.log("chapter.......id", item.id);
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => handleChapterClick(item, index)}
          style={styles.viewChapter}
        >
          <View style={{ width: '75%' }}>
            <Text style={{ fontSize: 20, margin: 1, color: 'black' }}>
              {item.name}
            </Text>
          </View>

          {paymentStatus || index === 0 ? ( // If payment is done or it's the first chapter
            <LinearGradient
              colors={[THEME_COLOR, THEME_COLOR2]}
              style={styles.openBtn}
            >
              <Text style={{ fontSize: 16, color: 'white' }}>Open</Text>
            </LinearGradient>
          ) : (
            <View style={styles.lockedContainer}>
              {/* Add your lock icon or text */}
              <Text style={{ fontSize: 16, color: 'black' }}>Locked</Text>
            </View>
          )}
        </TouchableOpacity>

        
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
        </TouchableOpacity>
        <Text style={styles.scienceTxt}>{name} Chapters</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 30 }}>
        <Text style={styles.ChapterTxt}>Chapters</Text>
      </View>

      <FlatList
        data={chaptersData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => <Chapter navigation={navigation} item={item} index={index} />}
        ListEmptyComponent={<Text>No data available</Text>}
        contentContainerStyle={{ padding: 1 }}
      />
    </View>
  );
};

export default English;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    width: horizontalScale(360),
    height: verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    backgroundColor: '#E9E9E9',
    text: 'center',
  },
  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
    marginTop: moderateScale(10),
  },
  scienceTxt: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    marginLeft: moderateScale(70),
    color: THEME_COLOR2,
  },
  ChapterTxt: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME_COLOR2,
  },
  viewChapter: {
    width: horizontalScale(330),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(15),
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  openBtn: {
    width: horizontalScale(70),
    height: verticalScale(30),
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 10,
  },
  lockedContainer: {
    width: horizontalScale(70),
    height: verticalScale(30),
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 10,
  },
});
