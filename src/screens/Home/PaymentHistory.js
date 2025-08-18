import { View, Text, StyleSheet, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { horizontalScale, moderateScale, verticalScale } from '../../components/responsive'
import { THEME_COLOR2 } from '../../utils/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { BASE_URL, STUDENT_PAYMENT_HISTORY } from '../../constant/StringAPI'
import { useFocusEffect } from '@react-navigation/native'

const PaymentHistory = ({navigation}) => {

    const [loading, setLoading] = useState(false)
    const [paymentData, setPaymentData] = useState([])

    console.log(".................",paymentData)



useFocusEffect(
    React.useCallback(() =>{
        PaymentHistoryApi()
    }, [])
)


    const PaymentHistoryApi = async () =>{
        console.log("Payment History..... ")

   try {
    const UserDataID = await AsyncStorage.getItem('UserDataID')
    const UserToken = await AsyncStorage.getItem('UserToken')


    const response = await axios.post(`${BASE_URL}${STUDENT_PAYMENT_HISTORY}`,
    {
        student_id : UserDataID
    },
    {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${UserToken}`,
        },
      },
      )
    
        console.log("payment ....",response.data.subscriptions)
     if(response.data.status === 200){
      setPaymentData(response?.data?.subscriptions || [])
     }

   } catch (error) {
    Alert.alert('Error fetching data:', error.message || error)
   } finally{
    setLoading(false)
   }

    }

    const renderItem =({item, index}) =>{
        console.log("item ...",item)
        return(
            <View  style={styles.itemContainer}>
                {/* <Text>{item.subscription_id}</Text>     */}
                <View style={{flexDirection:'row',width: horizontalScale(200)}}>
                <Text style={styles.containerTxt}>Order ID : </Text>
                <Text>{item.order_id}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <Text style={styles.containerTxt}>Payment ID :</Text>
                <Text> {item.payment_id}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                <Text style={styles.containerTxt}>Status : </Text>
                <Text>{item.status}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                 <Text style={styles.containerTxt}>Date : </Text>
                <Text>{item.created_at}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                 <Text style={styles.containerTxt}>Plan : </Text>
                <Text>{item.plan}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                 <Text style={styles.containerTxt}>Expire Date : </Text>
                <Text>{item.expires_at}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                 <Text style={styles.containerTxt}>Month : </Text>
                <Text>{item.name}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                 <Text style={styles.containerTxt}>Paid : </Text>
                <Text>{item.price}</Text>
                </View>
            </View>
        )
    }

  return (
    <View style={{flex:1}}>
      {/* <Text>PaymentHistory</Text> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backBtn}
            source={require('../../images/BackBtn.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTxt}>Payment History</Text>
      </View>

      <View    style={styles.ViewCamp}>
      <FlatList
       
         data={paymentData.slice().reverse()}
         renderItem={renderItem}
         keyExtractor={(item, index) => `${item.subscription_id}-${index}`}
         ListEmptyComponent={
          <Text style={styles.emptyText}>No subscriptions available.</Text>
        }
        refreshing={loading} // Show the loader when refreshing
         />        


    </View>
     
     <View >
     <TouchableOpacity style={styles.PlanView}
     onPress={() =>{
      navigation.navigate('StudentPayment');
     }}
     >
      <Text style={{color:'black', fontSize:20}}>
        Plan
      </Text>
     </TouchableOpacity>
     </View>
    </View>
  )
}

export default PaymentHistory
const styles = StyleSheet.create({
    header: {
        width: horizontalScale(360),
        height: verticalScale(50),
        backgroundColor: 'lightgray',
        alignItems: 'center',
        flexDirection: 'row',
      },
      headerTxt: {
        fontSize: 25,
        fontWeight: '600',
        marginLeft: moderateScale(70),
        color: THEME_COLOR2,
      },
      backBtn: {
        width: horizontalScale(25),
        height: verticalScale(20),
        resizeMode: 'contain',
        marginTop: moderateScale(10),
        marginLeft: moderateScale(10),
      },

      ViewCamp: {
        flex: 1,
        marginTop: moderateScale(20),
      },
      itemContainer: {
        width: horizontalScale(300),
        backgroundColor: 'white',
        marginBottom: moderateScale(15),
        borderRadius: moderateScale(8),
        justifyContent: 'space-between',
        alignSelf: 'center',
        elevation: 10,
        padding: moderateScale(10),
      },
      containerTxt: {
        fontSize: 16,
        fontWeight: '700',
      },

      PlanView:{
        backgroundColor: 'lightgreen',
        width:horizontalScale(100),
        height:verticalScale(50),
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-end',
        marginRight:moderateScale(20),
        borderRadius:10,
        marginBottom:moderateScale(20)  
      }
})
