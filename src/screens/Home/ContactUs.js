import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { horizontalScale, moderateScale, verticalScale } from '../../components/responsive'
import { THEME_COLOR2 } from '../../utils/Colors'

const ContactUs = ({navigation}) => {
  return (
    <View>
       <View style={styles.heading}>
                   <TouchableOpacity onPress={() => navigation.goBack()}>
                       <Image source={require('../../images/BackBtn.png')} style={styles.backBtn} />
                   </TouchableOpacity>
                   <Text style={styles.headingTxt}>Contact Us</Text>
               </View>


                <View  style={styles.comp}>


      <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Contact us
                </Text>

                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Email – infoklunest@gmail.com
                </Text>

                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Mobile no – 9702563808       8767170796
                </Text>
                </View>
    </View>
  )
}

export default ContactUs

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
        marginLeft: moderateScale(90),
        color: THEME_COLOR2,
    },

    comp:{
        width:horizontalScale(300),
        alignItems:'center',
        alignSelf:'center',
        marginTop:45
    }
})