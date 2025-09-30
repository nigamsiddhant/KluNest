import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../../../utils/Colors';
import RazorpayCheckout from "react-native-razorpay";
import axios from 'axios';
import { BASE_URL, SUBSCRIPTION } from '../../../../constant/StringAPI';
import { ScrollView } from 'react-native-gesture-handler';

const StudentPayment = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false); // For payment confirmation modal
  const [price, setPrice] = useState(''); // For the selected price






  const handleNavigateToPlan = (data) => {
    console.log("data===", data)
    navigation.navigate('Plane', { item: data });  // Navigate to the "Plan" page
  };


  return (
    <View style={styles.container}>

      <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../../images/BackBtn.png')} style={styles.backBtn} />
        </TouchableOpacity>
        <Text style={styles.headingTxt}>  Select Subscription</Text>
      </LinearGradient>



      {/* New Subscription Card */}

      <TouchableOpacity style={styles.subscriptionCard} onPress={() => { handleNavigateToPlan('1') }}>
        <View style={styles.subscriptionContent}>
          <Text style={styles.priceText}>Content View</Text>
          <Text style={styles.descriptionText}>Only content view - Enjoy syllabus based content in the form of text, Images and summary videos.  </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.subscriptionCard} onPress={() => { handleNavigateToPlan('2') }}>
        <View style={styles.subscriptionContent}>
          <Text style={styles.priceText}>Content View & Communication</Text>
          <Text style={styles.descriptionText}>Content view + communication with teachers -
            Everything in content view with Scheduled One - O - One meeting with teachers</Text>
        </View>
      </TouchableOpacity>


    </View >
  );
};

export default StudentPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
  },

  heading: {
    width: horizontalScale(360),
    height: verticalScale(60),
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
    width: horizontalScale(80),
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

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the modal overlay
  },

  modalContain: {
    width: horizontalScale(300),
    // padding: moderateScale(20),
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    paddingBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
  },

  modalText: {
    fontSize: 16,
    marginBottom: moderateScale(20),
  },

  payButton: {
    width: horizontalScale(250),
    paddingVertical: moderateScale(10),
    backgroundColor: THEME_COLOR,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: moderateScale(15),
  },

  payButtonText: {
    fontSize: 18,
    color: 'white',
  },

  closeButton: {
    width: horizontalScale(250),
    paddingVertical: moderateScale(10),
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 10,
  },

  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },

  subscriptionItem: {
    borderWidth: 2,
    margin: 20,
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
    alignContent: 'center',
    justifyContent: 'center',
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

  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C5AA0',
    marginBottom: verticalScale(4),
  },

  descriptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
    marginBottom: verticalScale(4),
  },

  buyNowButton: {
    backgroundColor: '#1ABC9C',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: 20,
  },

  buyNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
