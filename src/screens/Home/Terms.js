import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { horizontalScale, moderateScale, verticalScale } from '../../components/responsive'
import { THEME_COLOR2 } from '../../utils/Colors'

const Terms = ({ navigation }) => {
    return (
        <View>
            <View style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../images/BackBtn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <Text style={styles.headingTxt}>Terms and condition</Text>
            </View>
            
            <ScrollView>
            <View  style={styles.comp}>
                <Text style={{color:'black', fontSize:15, marginTop:10}}>
                    Welcome to KLUNEST, an educational Android application designed for
                    students from Class 6th to Class 10th. By using this app, you agree to comply with and be
                    bound by the following Terms and Conditions. Please read them carefully before accessing
                    or using any part of our services
                </Text>

                <Text style={{color:'black', fontSize:15, marginTop:10}}>
                    1. Collection of Personally Identifiable Information - User need to register an account to
                    access certain features, You agree to provide accurate and complete information during
                    registration. The information collected by Us is of the following nature: name , mobile
                    number , emailid , class , school name . We collect certain information about You to help
                    us serve You better. You are responsible for maintaining the confidentiality of your account
                    information.
                </Text>

                <Text style={{color:'black', fontSize:15, marginTop:10}}>
                    2.Use of Personal Information - The information collected by Us through our Website is
                    used by Us for various purposes to enable us to serve you better
                </Text>

                <Text style={{color:'black', fontSize:15, marginTop:10}}>
                    3. User Conduct - Users are expected to maintain respectful communication within the
                    app.Any misuse, abusive language, or inappropriate behavior may result in account
                    suspension or termination.
                </Text>

                <Text style={{color:'black', fontSize:15, marginTop:10}}>
                    All content, including text, images, videos, and other educational material, are the
                    intellectual property of KLUNEST education. Unauthorized use or distribution of any
                    content is strictly prohibited.
                </Text>


            </View>
            </ScrollView>
        </View>
    )
}

export default Terms

const styles = StyleSheet.create({
    heading: {
        width: horizontalScale(360),
        height: verticalScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(12),
        backgroundColor: '#E9E9E9',
    },

    backBtn: {
        width: horizontalScale(25),
        height: verticalScale(20),
        resizeMode: 'contain',
        marginTop: moderateScale(10),
    },

    headingTxt: {
        fontSize: 22,
        fontWeight: '700',
        alignSelf: 'center',
        marginLeft: moderateScale(60),
        color: THEME_COLOR2,
    },
    comp:{
        width:horizontalScale(300),
        alignItems:'center',
        alignSelf:'center',
        marginTop:45
    }
})