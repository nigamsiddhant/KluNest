
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Animated,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from "react-native";
// import Questions from "../Chapter/Questions";
// import { horizontalScale, verticalScale } from "../../../../components/responsive";
// import { ANSWER_SUBMIT, BASE_URL, QUESTION } from "../../../../constant/StringAPI";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const QuizPage = ({ navigation, route }) => {
//   const { id, name } = route.params;
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questionData, setQuestionData] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [fadeAnim] = useState(new Animated.Value(1));

//   useEffect(() => {
//     fetchQuestionData();
//   }, []);

//   const fetchQuestionData = async () => {
//     try {
//       const UserToken = await AsyncStorage.getItem('UserToken');
//       const response = await axios.post(`${BASE_URL}${QUESTION}`, { chapter_id: id }, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${UserToken}`,
//         },
//       });
//       console.log("------->>>>Img  :  ", response.data.questions[0].question_image)

//       setQuestionData(response.data.questions);
//       setAnswers(response.data.questions.map(question => ({ questionId: question.id, questionName: question.question, answer: '' })));
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   const handleAnswerSubmit = async () => {
//     const currentAnswer = answers[currentQuestionIndex];
//     const questionId = currentAnswer.questionId; 
//     const answer = currentAnswer.answer; 
  
//     if (!questionId) return; 
  
//     try {
//       const UserDataID = await AsyncStorage.getItem("UserDataID");
//       const UserToken = await AsyncStorage.getItem("UserToken");
  
//       const formData = new FormData();
//       formData.append("student_id", UserDataID);
//       formData.append("question_id", questionId);
//       formData.append("answer", answer);
  
//       const response = await axios.post(`${BASE_URL}${ANSWER_SUBMIT}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${UserToken}`,
//         },
//       });
  
//       if (response?.data?.status === "success") {
//         console.log("Answer submitted successfully");
//       }
//     } catch (error) {
//       console.log('Error submitting answer:', error);
//     }
//   };

//   const handleNext = () => {
//     // Check if the current answer field is empty
//     const currentAnswer = answers[currentQuestionIndex]?.answer.trim();
    
//     if (currentAnswer) {
//       handleAnswerSubmit();
//     } else {
//       // Alert.alert("Warning", "Please provide an answer before proceeding.");
//       // return; // Exit the function if the answer is empty
//     }
  
//     if (currentQuestionIndex < questionData.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       console.log("Quiz ended");
//       Alert.alert("Thank you", "Thank you for submitting your answers");
  
//       // Filter the answers to get only answered questions
//       const answeredQuestions = answers.filter(answer => answer.answer.trim() !== '');
//       navigation.navigate('Result', { id: questionData.length, answers: answeredQuestions, name:name });
//     }
  
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 100,
//       useNativeDriver: false,
//     }).start(() => {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1900,
//         useNativeDriver: false,
//       }).start();
//     });
//   };
  
//   const handleSubmit = () => {
//     Alert.alert(
//       "Confirm Submission",
//       "Are you sure you want to submit your answers?",
//       [
//         { text: "No", onPress: () => console.log("Submission canceled"), style: "cancel" },
//         { 
//           text: "Yes", 
//           onPress: () => {
//             console.log("Answers submitted:", answers);
//             // Filter the answers to get only answered questions with their IDs and names
//             const answeredQuestions = answers
//               .filter(answer => answer.answer.trim() !== '')
//               .map(answer => ({
//                 questionId: answer.questionId,
//                 questionName: answer.questionName, // Include questionName
//                 answer: answer.answer,
//               }));
  
//             console.log("answers ====>>>>", answers[0].questionName);
//             navigation.navigate('Result', { id: questionData.length, answers: answeredQuestions });
//           }, 
//           style: "default" 
//         }
//       ],
//       { cancelable: false }
//     );
//   };
  
  
//   const renderOptions = () => (
//     <View style={{ flex: 1 }}>
//       {/* <TextInput
//         style={styles.answerInput}
//         placeholder="Enter your Answer"
//         value={answers[currentQuestionIndex]?.answer}
//         onChangeText={(text) => {
//           const newAnswers = [...answers];
//           newAnswers[currentQuestionIndex].answer = text;
//           setAnswers(newAnswers);
//         }}
//       /> */}
//     </View>
//   );

//   // Function to count answered questions
//   const countAnsweredQuestions = () => {
//     return answers.filter(answer => answer.answer.trim() !== '').length;
//   };

//   return (
//     <ScrollView style={styles.scrollView}>
//       <View style={styles.container}>
//         <Text style={{ color: 'lightgreen', fontSize: 25 }}>{name}</Text>
//         {/* <Text style={styles.answerCount}>
//           Answered Questions: {countAnsweredQuestions()} / {questionData.length}
//         </Text> */}
//         <View style={styles.subContainer}>
//           <Questions
//             index={currentQuestionIndex}
//             question={questionData[currentQuestionIndex]?.question}
//             totalQuestions={questionData.length}
//           />
//         </View>
//         {renderOptions()}
//       </View>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25}}>
//         <TouchableOpacity
//           style={styles.btnNext}
//           onPress={() => setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0))}
//           disabled={currentQuestionIndex === 0}
//         >
//           <Text style={styles.btnNextText}>Previous</Text>
//         </TouchableOpacity>

//         {currentQuestionIndex < questionData.length - 1 ? (
//           <TouchableOpacity
//             style={styles.btnNext}
//             onPress={handleNext}
//           >
//             <Text style={styles.btnNextText}>NEXT</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.btnNext, { backgroundColor: 'lightgreen' }]}
//             onPress={handleSubmit}
//           >
//             <Text style={styles.btnNextText}>Submit</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: { backgroundColor: "#38588b" },
//   container: {
//     flex: 1,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//   },
//   subContainer: {
//     marginTop: 50,
//     marginBottom:16,
//     padding: 20,
//     paddingVertical:10,
//     borderRadius: 10,
//     backgroundColor: "white",
//     // alignItems: "center",
//     shadowColor: "#171717",
//     shadowOffset: { width: -6, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   btnNext: {
//     borderRadius: 10,
//     paddingVertical: 13,
//     paddingHorizontal: 20,
//     backgroundColor: "#ffffff",
//   },
//   btnNextText: {
//     color: "#333",
//     fontSize: 17,
//     letterSpacing: 1.1,
//   },
//   answerInput: {
//     width: horizontalScale(320),
//     height: verticalScale(160),
//     backgroundColor: 'white',
//     borderRadius:10,
//     elevation:2,
//     paddingHorizontal: 10,
//    textAlignVertical:'top',
//    shadowColor: "#171717",
//    shadowOffset: { width: -6, height: 6 },
//    shadowOpacity: 0.2,
//    shadowRadius: 3,
//   },
//   answerCount: {
//     marginVertical: 10,
//     fontSize: 18,
//     color: 'white',
//   },
// });

// export default QuizPage;

















































import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Questions from "../Chapter/Questions";
import { horizontalScale, verticalScale } from "../../../../components/responsive";
import { BASE_URL, CONTACT_ADMIN, QUESTION } from "../../../../constant/StringAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import for icons



const QuizPage = ({ navigation, route }) => {
  const { id, name,studentChaptId,subjectId } = route.params;
  console.log("params head..", route.params);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [questionID, setQuestionID] = useState()
  const [ questionName, setQuestionName] = useState()

  const [contactData, setContactData] = useState(null);

  
  console.log("studentChaptId------------------",studentChaptId)
  // console.log("subject id........",id)
  // console.log("questionID......" ,questionID)
  // console.log("..........................",questionName)

  console.log("contact qury ...",contactData)

  useEffect(() => {
    fetchQuestionData();
  }, []);

  const fetchQuestionData = async () => {
    try {
      const UserToken = await AsyncStorage.getItem('UserToken');
      const response = await axios.post(`${BASE_URL}${QUESTION}`, { chapter_id: id }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${UserToken}`,
        },
      });
      
      console.log(response.data)

      console.log(".........",response.data.questions[0].id)
      console.log(".........",response.data.questions[1].question)
      setQuestionID(response.data.questions[0].id)
      setQuestionName(response.data.questions[0].question)

      console.log("------->>>>Img  :  ", response.data.questions[0]?.question_image);
      setQuestionData(response.data.questions);


    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

    
 

  const handleContact = () => {
    Alert.alert(
      "Request",
      "Are you sure you want to contact?",
      [
        {
          text: "No",
          onPress: () => console.log("Submission Canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // Call the API here and wait for the response
              const response = await contactAdminApi();
  
              if (response && response.message) {
                // If the response contains a 'message', show it in the alert
                Alert.alert(
                  "Contact Confirmed",
                  `Your contact request has been sent. \n\nMessage: ${response.message}`,
                  [
                    {
                      text: "OK",
                      onPress: () => console.log("OK Pressed"),
                    },
                    {
                      text: "Plan",  // Add Plan option
                      onPress: () => {
                        // Navigate to the Plan page when "Plan" is clicked
                        navigation.navigate('StudentPayment'); // Replace 'PlanPage' with the actual name of your plan screen
                      },
                    }
                  ],
                  { cancelable: false }
                );
              } else {
                // If response doesn't contain a message or there's an issue
                Alert.alert(
                  "Error",
                  "Something went wrong. Please try again.",
                  [
                    {
                      text: "OK",
                      onPress: () => console.log("OK Pressed"),
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("API error:", error);
              Alert.alert(
                "Error",
                "There was an issue with the API request. Please try again.",
                [
                  {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                  },
                ]
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  
  const contactAdminApi = async () => {
    console.log("contact to admin......");
  
    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const UserToken = await AsyncStorage.getItem('UserToken');
      const SubjectID = await AsyncStorage.getItem('SubjectID');
      console.log("Subject .....", SubjectID);
      console.log("subject data...", id);
  
      const response = await axios.post(
        `${BASE_URL}${CONTACT_ADMIN}`,
        {
          student_id: UserDataID,
          subject_id: subjectId,
          chapter_id: id,
          question_id: questionID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${UserToken}`,
          },
        }
      );
  
      console.log("contact response", response.data);
  
      // Return the response data (message) that we will use in the alert
      return response.data;
  
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
      throw error; // Rethrow the error so that the caller can handle it
    }
  };
  




  useEffect(() => {
    fetchQuestionData();
  }, [id]);

  const handleNext = () => {
    if (currentQuestionIndex < questionData.length - 1) {
      // Update the current question index
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
  
      // Update questionID with the ID of the next question
      setQuestionID(questionData[nextIndex]?.id);
      setQuestionName(questionData[nextIndex]?.question)
  
    } else {
      Alert.alert("Thank you", "Thank you for completing the quiz!");
      navigation.navigate('Result', { id: questionData.length, name: name });
    }
  
    // Animating fade transition
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1900,
        useNativeDriver: false,
      }).start();
    });
  };
  
  const handleSubmit = () => {
    Alert.alert(
      "Confirm ",
      "Are you sure you want to End ?",
      [
        { text: "No", onPress: () => console.log("Submission canceled"), style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            navigation.navigate('Result', { id: questionData.length, name: name });
          }, 
          style: "default" 
        }
      ],
      { cancelable: false }
    );
  };

  // const handleContact = () => {
  //   Alert.alert(
  //     "Request",
  //     "Are you sure you want to contact?",
  //     [
  //       {
  //         text: "No",
  //         onPress: () => console.log("Submission Canceled"),
  //         style: "cancel"
  //       },
  //       {
  //         text: "Yes",
  //         onPress: () => {
  //           // Call the API here
  //           contactAdminApi()
  //             .then(() => {
  //               // After the API call succeeds, show the second alert
  //               Alert.alert(
  //                 "Contact Confirmed",
  //                 "Your contact request has been sent.",
  //                 // console.log(response.data)
  //                 // contactData
  //                 [
  //                   {
  //                     text: "OK",
  //                     onPress: () => console.log("OK Pressed")
  //                   }
  //                 ],
  //                 { cancelable: false }
  //               );
  //             })
  //             .catch((error) => {
  //               // Handle API error here
  //               console.error("API error:", error);
  //             });
  //         }
  //       }
  //     ],
  //     { cancelable: false }
  //   );
  // };

  // const handleContact = () => {
  //   Alert.alert(
  //     "Request",
  //     "Are you sure you want to contact?",
  //     [
  //       {
  //         text: "No",
  //         onPress: () => console.log("Submission Canceled"),
  //         style: "cancel",
  //       },
  //       {
  //         text: "Yes",
  //         onPress: () => {
  //           // Call the API here
  //           contactAdminApi()
  //             .then((response) => {
  //               // Assuming `response.data` contains the required contact data
  
  //               // Store the received contact data in the state
  //               // setContactData(response?.data);  // Update the state with API response
  
  //               // After the API call succeeds, show the second alert
  //               Alert.alert(
  //                 "Contact Confirmed",
  //                 `Your contact request has been sent. \n\nContact Data: ${JSON.stringify(contactData)}`,
  //                 [
  //                   {
  //                     text: "OK",
  //                     onPress: () => console.log("OK Pressed"),
  //                   },
  //                 ],
  //                 { cancelable: false }
  //               );
  //             })
  //             .catch((error) => {
  //               // Handle API error here
  //               console.error("API error:", error);
  //             });
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };
  



  

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setQuestionID(questionData[prevIndex]?.id);
      setQuestionName(questionData[prevIndex]?.question)
    }
  };





  const renderImage = (imageUrl) => {
    if (imageUrl) {
      return (
        <Image
          source={{ uri: `${BASE_URL}${imageUrl}` }}
          style={styles.questionImage}
        />
      );
    }
    return null;
  };

  // If no questions are available, display a message
  const renderQuestionContent = () => {
    if (questionData.length === 0) {
      return (
        <Text style={styles.noQuestionText}>Question is not available.</Text>
      );
    }

    return (
      <>
        {renderImage(questionData[currentQuestionIndex]?.question_image)}
        <Questions
          index={currentQuestionIndex}
          question={questionData[currentQuestionIndex]?.question}
          totalQuestions={questionData.length}
        />
      </>
    );
  };

  return (
    <View style={styles.container}> 
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={{ color: 'lightgreen', fontSize: 25 }}>{name}</Text>
        <View style={styles.contactView}>
       <TouchableOpacity onPress={handleContact}>
        {/* <Text style={styles.btnNextText}>Contact</Text> */}
     <Icon  name= "call" size={25}/>

       </TouchableOpacity>
       </View>

        <View style={styles.subContainer}>
          {/* Render question content or no question available message */}
          {renderQuestionContent()}
        </View>

      
      </ScrollView>
    

      {/* Fixed at bottom */}
      <View style={styles.bottomButtonsContainer}>

             

      <TouchableOpacity
          style={styles.btnNext}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.btnNextText}>Previous</Text>
        </TouchableOpacity>

        {currentQuestionIndex < questionData.length - 1 ? (
          <TouchableOpacity
            style={styles.btnNext}
            onPress={handleNext}
          >
            <Text style={styles.btnNextText}>NEXT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            // style={[styles.btnNext, { backgroundColor: 'lightgreen' }]}
            // onPress={handleSubmit}
          >
            {/* <Text style={styles.btnNextText}>END</Text> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38588b",
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  subContainer: {
    marginTop: 50,
    marginBottom: 16,
    padding: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: -6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  btnNext: {
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
  },
  btnNextText: {
    color: "#333",
    fontSize: 17,
    letterSpacing: 1.1,
  },
  questionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginBottom: 20,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  noQuestionText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 20,
  },
  contactView:{
  backgroundColor:'lightgreen',
   width:horizontalScale(40),
   height:verticalScale(35),
   marginTop:25,
  marginLeft:280,
  justifyContent:'center',
  alignItems:'center',
  borderRadius:10
  }
});

export default QuizPage;
