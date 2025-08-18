import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { horizontalScale, moderateScale, verticalScale } from '../../components/responsive'
import { THEME_COLOR2 } from '../../utils/Colors'

const Cancellation = ({navigation}) => {
  return (
    <View>
    
       <View style={styles.heading}>
                       <TouchableOpacity onPress={() => navigation.goBack()}>
                           <Image source={require('../../images/BackBtn.png')} style={styles.backBtn} />
                       </TouchableOpacity>
                       <Text style={styles.headingTxt}>Cancellation and refund</Text>
                   </View>


                   <View  style={styles.comp}>

                <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>
                    KLUNEST operates on a freemium model. Some content and features are available for free,
                    while full access requires a subscription. Payments for subscriptions are non-refundable.
                    In case of technical issues or billing errors, users can contact customer support for
                    assistance.
                </Text>

                   </View>

    </View>
  )
}

export default Cancellation



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
        marginLeft: moderateScale(50),
        color: THEME_COLOR2,
    },

    comp:{
        width:horizontalScale(300),
        alignItems:'center',
        alignSelf:'center',
        marginTop:45
    }
})