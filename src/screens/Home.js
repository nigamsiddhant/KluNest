import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { horizontalScale, verticalScale } from '../components/responsive'
import HomePage from './Home/HomePage'
import Classes from './Home/Classes'
import Profile from './Home/Profile'

const Home = () => {


  const [selctedtab, setSelectedTab] = useState(0)


  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Home</Text> */}
      {selctedtab == 0? <HomePage/>: selctedtab == 1? <Classes/>: <Profile/>}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomTab} onPress={() =>{
          setSelectedTab(0);
        }}>
           <Image source={require('../images/HomeIcon.png')} style={[styles.tabIcon,{tintColor: selctedtab == 0 ? '#7F3DFF':'#C6C6C6'}]}/>
        </TouchableOpacity>


         <TouchableOpacity style={styles.bottomTab} onPress={() =>{
          setSelectedTab(1);
         }}>
            <Image source={require('../images/ClassesIcon.png')} style={[styles.tabIcon,{width:horizontalScale(41),tintColor:selctedtab == 1 ? '#7F3DFF':'#C6C6C6'}]}/>
         </TouchableOpacity>
         
        
        <TouchableOpacity style={styles.bottomTab} onPress={() =>{
          setSelectedTab(2)
        }}>
          <Image source={require('../images/ProfileIcon.png')} style={[styles.tabIcon,{tintColor: selctedtab == 2 ? '#7F3DFF':'#C6C6C6'}]}/>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  )
}

export default Home
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f2f2f2'
  },

  bottomNav:{
    width:horizontalScale(360),
    height:verticalScale(50),
    position:'absolute',
    bottom:-1,
    backgroundColor:'#FFFFFF',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
    
  },
  bottomTab:{
    width:horizontalScale(120),
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red'
    
    
  },
  tabIcon:{
    width:horizontalScale(32),
    height:verticalScale(50),
    resizeMode:'contain',
    tintColor:'#C6C6C6'
  }
  

})



























// import React, { useState } from 'react';
// import { StyleSheet, View, Text, Button, TextInput, Alert } from 'react-native';

// const initialTodos = [
//   { id: 1, name: 'John Doe', subject: 'Math', date: '2024-10-11' },
//   { id: 2, name: 'Jane Smith', subject: 'Science', date: '2024-10-12' },
// ];

// const App = () => {
//   const [todos, setTodos] = useState(initialTodos);
//   const [editableId, setEditableId] = useState(null);
//   const [newSubject, setNewSubject] = useState('');

//   const handleEdit = (id, currentSubject) => {
//     setEditableId(id);
//     setNewSubject(currentSubject);
//   };

//   const handleSave = (id) => {
//     setTodos(todos.map(todo => 
//       todo.id === id ? { ...todo, subject: newSubject } : todo
//     ));
//     setEditableId(null);
//     setNewSubject('');
//   };

//   const handleDelete = (id) => {
//     setTodos(todos.filter(todo => todo.id !== id));
//     Alert.alert('Delete Todo', `Deleted todo with ID: ${id}`);
//   };

//   return (
//     <View style={styles.container}>
//       {todos.map(todo => (
//         <View key={todo.id} style={styles.todoContainer}>
//           <Text>ID: {todo.id}</Text>
//           <Text>Name: {todo.name}</Text>
//           {editableId === todo.id ? (
//             <>
//               <TextInput 
//                 style={styles.input}
//                 value={newSubject}
//                 onChangeText={setNewSubject}
//               />
//               <Button title="Save" onPress={() => handleSave(todo.id)} />
//             </>
//           ) : (
//             <>
//               <Text>Subject: {todo.subject}</Text>
//               <Text>Date: {todo.date}</Text>
//               <View style={styles.buttonContainer}>
//                 <Button title="Edit" onPress={() => handleEdit(todo.id, todo.subject)} />
//                 <Button title="Delete" onPress={() => handleDelete(todo.id)} color="red" />
//               </View>
//             </>
//           )}
//         </View>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   todoContainer: {
//     padding: 15,
//     marginVertical: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default App;
