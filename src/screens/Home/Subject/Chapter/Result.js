// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import React from 'react';
// import { horizontalScale, verticalScale } from '../../../../components/responsive';
// import { THEME_COLOR, THEME_COLOR2 } from '../../../../utils/Colors';

// const Result = ({ navigation, route }) => {
//   const { id, answers , question } = route.params;
//   console.log("question",answers)

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         {/* <Text style={styles.resultTxt}>Result</Text> */}
//         <Text style={styles.totalText}>Total Questions: {id}</Text>
//         <Text style={styles.answeredText}>Answered Questions: {answers.length}</Text>
//       </View>

//       <FlatList
//         data={answers}
//         keyExtractor={(item) => item.questionId.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.answerContainer}>
//             {/* <Text style={styles.questionText}>Question ID: {item.questionId}</Text> */}
//             <Text>{item.questionName}</Text>
//             <Text style={styles.answerText}>Your Answer : {item.answer}</Text>
//           </View>
//         )}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// export default Result;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: THEME_COLOR,
//     padding: 20,
//   },
//   header: {
//     backgroundColor: 'lightcoral',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   resultTxt: {
//     color: 'white',
//     fontSize: 25,
//     fontWeight: 'bold',
//   },
//   totalText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 5,
//   },
//   answeredText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 5,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   answerContainer: {
//     padding: 15,
//     marginVertical: 5,
//     backgroundColor: '#AEF39D',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//     elevation: 2, // For Android shadow
//   },
//   questionText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   answerText: {
//     marginTop: 5,
//     fontSize: 14,
//     color: THEME_COLOR2,
//   },
// });




















import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { THEME_COLOR } from '../../../../utils/Colors'

const Result = () => {
  return (
<View style={styles.container}>
<View style={styles.header}>
      <Text>Thank You </Text>
      </View>
    </View>
  )
}

export default Result
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: THEME_COLOR,
    padding: 20,
  },

    header: {
    backgroundColor: 'lightcoral',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    marginTop:25
  },
})