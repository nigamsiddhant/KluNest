import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../../../components/responsive';
import { THEME_COLOR2 } from '../../../../utils/Colors';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { BASE_URL, SUBSCRIPTION } from '../../../../constant/StringAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import RazorpayCheckout from "react-native-razorpay";

const Plane = ({ navigation, route }) => {
  const [containPlane, setContainPlane] = useState([]); // Default to an empty array

  console.log("navigation=====...", route.params.item);

  useEffect(() => {
    subscriptionApi();
  }, []);




  // const subscriptionApi = async () => {

  //   // const UserDataID = await AsyncStorage.getItem('UserDataID');
  //   const UserDataID= await AsyncStorage.getItem('UserDataID')

  //   // axios.get("http://68.183.92.60:8098/api/subscription?plan="+`${route.params.item}`)
  //   axios.get(`${BASE_URL}/api/subscription?plan=${route.params.item}`)
  //   axios.get
  //     .then((result) => {
  //       if (result.data && result.data.subscriptions) {
  //         console.log("Subscriptions====", result.data.subscriptions);  // Log subscriptions if present
  //         setContainPlane(result.data.subscriptions);
  //       } else {
  //         console.log("Subscriptions not found or undefined.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };


  const subscriptionApi = async () => {
    try {
      const UserDataID = await AsyncStorage.getItem('UserDataID');
      const plan = route.params.item;

      if (!plan) {
        console.error("Plan is missing in the route parameters.");
        return;
      }

      const url = `${BASE_URL}api/subscription?plan=${plan}`;
      console.log("Request URL: ", url);

      const result = await axios.get(url);

      if (result.data && result.data.subscriptions) {
        console.log("Subscriptions====", result.data.subscriptions);
        setContainPlane(result.data.subscriptions);
      } else {
        console.log("Subscriptions not found or undefined.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };





  const renderItem = ({ item }) => {
    console.log("item===", item)
    return (
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionContent}>
          <View style={styles.priceContainer}>
            {item.discounted_price ? (
              <>
                <Text style={styles.priceText}>Rs. {item.discounted_price}</Text>
                {item.actual_price && (
                  <Text style={styles.originalPriceText}>Rs. {item.actual_price}</Text>
                )}
              </>
            ) : (
              <Text style={styles.priceText}>{item.name}</Text>
            )}
          </View>
          <Text style={styles.descriptionText}>
            {item.name ? `Get ${item.name} access for content` : 'Short Description of this subscription'}
          </Text>
        </View>
        <TouchableOpacity style={styles.buyNowButton} onPress={() => { CreateOrder(item.id) }}>
          <Text style={styles.buyNowText}>Buy Now!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // RazorPay Integration ////

  const CreateOrder = async (id) => {
    const UserDataID = await AsyncStorage.getItem('UserDataID')

    const params = {
      "student_id": UserDataID,
      "subscription_id": id
    }
    console.log("sub plan ", params)
    // axios.post("http://68.183.92.60:8098/api/subscription/create-order",
    // params
    // )
    axios.post(`${BASE_URL}api/subscription/create-order`, params)
      .then((response) => {
        console.log("response from createOrder===", response.data);
        if (response.status == 200) {
          handlePayment(response.data.order_id, response.data.student_id, response.data.subscription_id, response.data.price)
          // Passed OrderId,Student_id,Subscription_id 
        }
      })
      .catch((error) => {
        console.log("Error in Create Order====", error);

      })
  }

  const handlePayment = (orderId, student_id, subscription_id, amount) => {
    console.log("amount====", amount);

    const options = {
      description: 'Subscription Plan',
      // image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_live_RR1YXd2icABKcI',
      // key: 'rzp_test_x8wm1rwROYLo4t',

      amount: amount,
      name: 'KLUnest',
      order_id: orderId, // Replace this with an order_id created using Orders API.
      // prefill: {
      //   email: 'preeti@example.com',
      //   contact: '9191919191',
      //   name: 'Preeti Jaswal'
      // },
      theme: { color: '#53a20e' }
    };
    console.log("check data........", options)
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle succes

        console.log("check data........", data)

        // alert(`Success: ${data.razorpay_payment_id}`);
        VerifyPaymentStatus(orderId, data)
      })
      .catch((error) => {
        console.log("Lets check data........", error)
        // handle failure
        Alert.alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  // const VerifyPaymentStatus=(orderId,data)=>{
  //    const params={
  //     order_id:orderId,
  //     razorpay_signature:data.razorpay_signature,
  //     razorpay_payment_id:data.razorpay_payment_id,
  //     razorpay_order_id:data.razorpay_order_id
  //    }

  //    console.log("Params===",params);

  //    axios.post("http://68.183.92.60:8098/api/subscription/verify-payment",params,
  //    )
  //    .then((response) => {
  //     console.log("verify-payment===",response.data.message);
  //     console.log("verify-payment===",response.data);
  //     Alert.alert(response.data.message);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // }

  const VerifyPaymentStatus = (orderId, data) => {
    const params = {
      //  order_id:orderId,
      razorpay_signature: data.razorpay_signature,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_order_id: data.razorpay_order_id
    }

    console.log("Params===", params);

    // axios.post("http://68.183.92.60:8098/api/subscription/verify-payment",params, )
    axios.post(`${BASE_URL}api/subscription/verify-payment`, params)
      .then((response) => {
        console.log("verify-payment===", response.data.message);
        console.log("verify-payment===", response.data);
        //  Alert.alert(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });

  }





  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../../images/BackBtn.png')} style={styles.backBtn} />
        </TouchableOpacity>
        <Text style={styles.headingTxt}>  Plan</Text>
      </LinearGradient>
      {containPlane.length > 0 ? (
        <FlatList
          data={containPlane}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 1 }}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No subscriptions available</Text>
        </View>
      )}


    </View>
  );
};

export default Plane;

const styles = StyleSheet.create({
  heading: {
    width: horizontalScale(360),
    height: verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
  },

  backBtn: {
    width: horizontalScale(25),
    height: verticalScale(20),
    resizeMode: 'contain',
    tintColor: 'white',
    alignSelf: 'center',
  },

  headingTxt: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    color: 'white',
  },

  CompView: {
    width: horizontalScale(320),
    height: verticalScale(100),
    backgroundColor: 'white',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    elevation: 10,
  },

  containTxt: {
    color: THEME_COLOR2,
    fontSize: 20,
    fontWeight: '600',
  },

  payTouch: {
    width: horizontalScale(90),
    height: verticalScale(40),
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  payTxt: {
    color: 'black',
    fontSize: 18,
  },

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noDataText: {
    fontSize: 18,
    color: THEME_COLOR2,
  },

  subscriptionCard: {
    width: horizontalScale(320),
    height: verticalScale(80),
    backgroundColor: 'white',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal: horizontalScale(20),
  },

  subscriptionContent: {
    flex: 1,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },

  priceText: {
    fontSize: 14.37,
    fontWeight: '600',
    color: '#2C5AA0',
    marginRight: horizontalScale(8),
  },

  originalPriceText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },

  descriptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },

  buyNowButton: {
    backgroundColor: '#1ABC9C',
    width: horizontalScale(72),
    height: verticalScale(30),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buyNowText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});