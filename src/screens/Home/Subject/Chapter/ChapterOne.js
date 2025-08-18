





// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   TextInput
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {FlatList, ScrollView} from 'react-native-gesture-handler';
// import {
//   horizontalScale,
//   moderateScale,
//   verticalScale,
// } from '../../../../components/responsive';
// import LinearGradient from 'react-native-linear-gradient';
// import {THEME_COLOR, THEME_COLOR2} from '../../../../utils/Colors';
// import {useNavigation} from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {ANSWER_SUBMIT, BASE_URL, QUESTION} from '../../../../constant/StringAPI';

// const ChapterOne = ({navigation, route}) => {
//   const {id, name} = route.params;
//   console.log('00000000', id, name);

//   const [questionData, setQuestionData] = useState('');

//   const [ currentIndex, setCurrentIndex] = useState(1)
   
//   const [answerData, setAnswerData] = useState('')


//   useEffect(() => {
//     QuestionDataApi();
//   }, []);

//   const QuestionDataApi = async () => {
//     console.log('Questions Api ...........');

//     try {
//       const UserDataID = await AsyncStorage.getItem('UserDataID');
//       // const Token = await AsyncStorage.getItem('Token');
//       const UserToken = await AsyncStorage.getItem('UserToken');

//       console.log(UserDataID);
//       console.log(UserToken);

//       const response = await axios.post(
//         `${BASE_URL}${QUESTION}`, {
//           chapter_id: id,
//         },{
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${UserToken}`,
//           },
//         },
//       );
//       console.log('question -------->>>', response.data.questions);
//       console.log('question --------======', response.data.questions[0].id);

//     AsyncStorage.setItem = ("QuestionID", JSON.stringify(response.data.questions[0].id))
//     console.log("QuestionId====>>>",response.data.questions[0].id)


//       setQuestionData(response?.data?.questions);
//     } catch (error) {
//       console.error('Error Fetch Data', error.message || error);
//       // Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//  const SubmitAnswerApi = async() =>{
//   console.log('AnswerSubmit Api ------- ')
//   try {
//      const UserDataID = AsyncStorage.getItem("UserDataID")
//      const UserToken = AsyncStorage.getItem("UserToken")
//      const QuestionID = AsyncStorage.getItem("QuestionID")

//      console.log(UserDataID);
//      console.log(UserToken);
//      console.log(QuestionID)

//      const param ={
//       student_id: UserDataID,
//       question_id: QuestionID,
//       answer: answerData
//      }
//     //  console.log(" params===",param)
//      const headers = new Headers();
//      headers.append('Content-Type', 'application/json')
    
//     const response = await axios.post(`${BASE_URL}${ANSWER_SUBMIT}`,
//       param,
//       headers,
//     );

//     console.log("answer data====>>> ", response.data)
     



//   } catch (error) {
//     Alert.alert(' Error' , 'Something went wrong. Please try again.')
//   }

//  }

// return (
//   <View style={styles.container}>
//         <View style={styles.heading}>
//            <TouchableOpacity onPress={() => navigation.goBack()}>
//              <Image
//               source={require('../../../../images/BackBtn.png')}
//               style={styles.backBtn}
//             />
//           </TouchableOpacity>
//           <Text style={styles.headTxt}>{name}</Text>
//         </View>
       
//       <Text >{name} : {' ' + currentIndex +'/' + questionData.length}</Text>
         
//         <Text>{name[currentIndex]}</Text>

//        <TouchableOpacity>
//      <Text>Submit</Text>

//        </TouchableOpacity>




//         </View>
// )


// };



// export default ChapterOne;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16, // Added padding for better spacing
//   },
//   heading: {
//     width: horizontalScale(360),
//     height: verticalScale(50),
//     alignSelf: 'center',
//     flexDirection: 'row',
    
//     padding: moderateScale(12),
//     backgroundColor: '#E9E9E9',
//     marginTop: -15,
//   },
//   backBtn: {
//     width: horizontalScale(25),
//     height: verticalScale(20),
//     resizeMode: 'contain',
//     marginTop: moderateScale(10),
//   },
//   headTxt: {
//     width:horizontalScale(300),
//     height:verticalScale(50),
//     fontSize: 20,
//     fontWeight: '700',
//     // alignSelf: 'center',
//     // marginLeft: moderateScale(50),
//     color: THEME_COLOR2,
//     textAlign:'center'
//   },
//   scrollContainer: {
//     alignItems: 'center', // Center content horizontally
//     paddingBottom: 20, // Added bottom padding for scrollable content
//   },
//   stepOne: {
//     width: horizontalScale(300),
//     // height: verticalScale(100), // Removed fixed height

//     marginTop: 30,
//   },
//   questionText: {
//     fontSize: 16,
//     marginBottom: 10, // Space between question and input
//   },
//   stepOneInput: {
//     width: horizontalScale(300),
//     height: verticalScale(140), // Reduced height for better fit
//     marginBottom: 50,
//     borderWidth: 1,
//     borderRadius: 5, // Optional: rounded corners for the input
//     paddingHorizontal: 10, // Padding inside the input
//   },

//   LinearBtn: {
//     width: horizontalScale(290),
//     height: verticalScale(40),
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     // marginTop: moderateScale(6),
//   },

//   LoginBtn: {
//     width: '100%',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//     // color:'red'
//   },

//   btnView: {
//     width: '100%',
//     height: 60,
//     bottom: -20,
//     position: 'absolute',
//     justifyContent: 'center',
//     backgroundColor: '#E9E9E9',
//     borderRadius:10
//   },
// });



























import { View, Text } from 'react-native'
import React from 'react'

const ChapterOne = () => {
  return (
    <View>
      <Text>ChapterOne</Text>
    </View>
  )
}

export default ChapterOne