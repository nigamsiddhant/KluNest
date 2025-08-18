import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { THEME_COLOR, THEME_COLOR2 } from '../utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
import CustomeTextInput from '../components/CustomeTextInput'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler'
import axios from 'axios'
import { BASE_URL, FORGET_USER } from '../constant/StringAPI'

const ForgetPasswordStudent = () => {

  const navigation = useNavigation()

  const[mobile, setMobile] = useState('');
  const[MobileErrormessage, setMobileErrormessage] = useState('');




   const validate = () =>{
    let isValid = false;

    if (mobile === '') {
        setMobileErrormessage('Please Enter Mobile Number');
        isValid = false;
      } else if (mobile.length < 10) {
        setMobileErrormessage('Please Enter 10 digit Number');
        isValid = false;
      } else if (mobile.length > 10) {
        setMobileErrormessage('Please Enter Exactly 10 digit Number');
        isValid = false;
      } else if (!/^\d+$/.test(mobile)) {
        setMobileErrormessage('Please Enter Only Numbers');
        isValid = false;
      } else {
        setMobileErrormessage('');
        isValid = true;
      }

      return isValid
   };


   

   const ForgetPasswordApi = async () =>{

    console.log("Forgate password Api ...... ")


    try {
        
        const params = {
            mobile : mobile
        }

        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
    
        const response = await axios.post(
            `${BASE_URL}${FORGET_USER}`,
            params,
            headers,
        );

        console.log(response.data)

      if(response.data.status === 200){
        Alert.alert('Password',response?.data?.message)
        setMobile('')
      }
      
      if(response.data.status != 200){
        console.log("In Vailid ----> ", response?.data?.message)
        setMobileErrormessage(response?.data?.message)
      }


    } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
    }

   }





  return (
    <View style={styles.container}>

        <View style={styles.ViewComp}>
         <Text style={styles.header}>Forgot Password</Text>
         {/* <Text style={[styles.header,{marginTop:-20}]}>Student</Text> */}

          <Text style={styles.enter}>Mobile Number</Text>   
        <CustomeTextInput
        placeholder='Enter Mobile Number'
        keyboardType='numeric'
        value={mobile}
        onChangeText={txt => {
            // Allow only numbers
            const filteredText = txt.replace(/[^0-9]/g, '').slice(0, 10);
            setMobile(filteredText);
          }}
          isValid={MobileErrormessage == '' ? true : false}
        />
        {MobileErrormessage != '' && (
          <Text style={styles.errorTxt}>{MobileErrormessage}</Text>
        )}


     <LinearGradient
          colors={[THEME_COLOR, THEME_COLOR2]}
          style={styles.LinearBtn}>
          <TouchableOpacity
            style={styles.LoginBtn}
            onPress={() => {
                // navigation.navigate('Login')
              const isValid = validate();
              if (isValid) {
                ForgetPasswordApi()
            //   navigation.navigate('Login')

              }
            }}
            >
            <Text style={styles.LoginBtn}>Send Password</Text>
          </TouchableOpacity>
           </LinearGradient>
   
   <View style={{ marginTop: 10, marginLeft:200}}>

    <TouchableOpacity onPress={() =>{
        navigation.navigate('Login')
    }
    } >

  <Text style={styles.loginTxt}>Login</Text>
  </TouchableOpacity>
   </View>

       
        </View>

      
    </View>
  )
}

export default ForgetPasswordStudent

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: THEME_COLOR,
        // justifyContent:'center'  
    },
    ViewComp:{
        width:horizontalScale(320),
        height:verticalScale(330),
        backgroundColor:'white',
        // justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
        borderWidth:1,
        borderRadius:10,
        marginTop:130,
        elevation:20
    },
    header:{
        color:THEME_COLOR2,
        fontSize:20,
        margin:20,
        fontWeight:'600'
    },
    enter: {
        color: 'black',
        marginLeft: -200,
        // backgroundColor:'red',
        marginBottom:-15
      },


  LinearBtn: {
    width: horizontalScale(290),
    height: verticalScale(40),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: moderateScale(120),
  },

  LoginBtn: {
    width:'100%',
    color: '#FFFFFF',
    textAlign:'center',
    fontSize: 18,
    fontWeight: '600',
  },
  errorTxt: {
    color: 'red',
    marginLeft: moderateScale(-120),
    // marginTop:2
  },
  loginTxt:{
    color:THEME_COLOR2,
    fontSize:20,
    fontWeight:'700',
    marginLeft:40,
    marginTop:5
    
  }
    
})





























// import { View, Text, StyleSheet } from 'react-native'
// import React, { useState } from 'react'
// import { THEME_COLOR, THEME_COLOR2 } from '../utils/Colors'
// import { useNavigation } from '@react-navigation/native'
// import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
// import CustomeTextInput from '../components/CustomeTextInput'
// import LinearGradient from 'react-native-linear-gradient'
// import { TouchableOpacity } from 'react-native-gesture-handler'

// const ForgetPasswordStudent = () => {

//   const navigation = useNavigation()

//   // Initialize `mobile` as an empty string to avoid undefined errors
//   const [mobile, setMobile] = useState('');
//   const [MobileErrormessage, setMobileErrormessage] = useState('');

//   const validate = () => {
//     let isValid = false;

//     if (mobile === '') {
//       setMobileErrormessage('Please Enter Mobile Number');
//       isValid = false;
//     } else if (mobile.length < 10) {
//       setMobileErrormessage('Please Enter 10 digit Number');
//       isValid = false;
//     } else if (mobile.length > 10) {
//       setMobileErrormessage('Please Enter Exactly 10 digit Number');
//       isValid = false;
//     } else if (!/^\d+$/.test(mobile)) {
//       setMobileErrormessage('Please Enter Only Numbers');
//       isValid = false;
//     } else {
//       setMobileErrormessage('');
//       isValid = true;
//     }

//     return isValid;
//   };

//   return (
//     <View style={styles.container}>

//       <View style={styles.ViewComp}>
//         <Text style={styles.header}>Forget Password</Text>

//         <Text style={styles.enter}>Mobile Number</Text>
//         <CustomeTextInput
//           placeholder='Enter Mobile Number'
//           keyboardType='numeric'
//           value={mobile}
//           onChangeText={txt => {
//             // Allow only numbers
//             const filteredText = txt.replace(/[^0-9]/g, '').slice(0, 10);
//             setMobile(filteredText);
//           }}
//           isValid={MobileErrormessage === ''} // Adjusted the condition
//         />
//         {MobileErrormessage !== '' && (
//           <Text style={styles.errorTxt}>{MobileErrormessage}</Text>
//         )}

//         <LinearGradient
//           colors={[THEME_COLOR, THEME_COLOR2]}
//           style={styles.LinearBtn}>
//           <TouchableOpacity
//             style={styles.LoginBtn}
//             onPress={() => {
//               const isValid = validate();
//               if (isValid) {
//                 // Call any API or navigation logic here if needed
//                 navigation.navigate('Login');
//               }
//             }}
//           >
//             <Text style={styles.LoginBtn}>New Password</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//       </View>
//     </View>
//   );
// };

// export default ForgetPasswordStudent;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: THEME_COLOR,
//     // justifyContent:'center'  
//   },
//   ViewComp: {
//     width: horizontalScale(320),
//     height: verticalScale(330),
//     backgroundColor: 'white',
//     // justifyContent:'center',
//     alignSelf: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginTop: 130,
//   },
//   header: {
//     color: THEME_COLOR2,
//     fontSize: 20,
//     margin: 20,
//     fontWeight: '600',
//   },
//   enter: {
//     color: 'black',
//     marginLeft: -180,
//     // backgroundColor:'red',
//     marginBottom: -15,
//   },

//   LinearBtn: {
//     width: horizontalScale(290),
//     height: verticalScale(40),
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginTop: moderateScale(70),
//   },

//   LoginBtn: {
//     width: '100%',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   errorTxt: {
//     color: 'red',
//     marginLeft: moderateScale(-120),
//     // marginTop:2
//   },
// });
