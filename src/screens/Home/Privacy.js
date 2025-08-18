import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { horizontalScale, moderateScale, verticalScale } from '../../components/responsive'
import { THEME_COLOR2 } from '../../utils/Colors'

const Privacy = ({ navigation}) => {
    return (
        <View>
            <View style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../images/BackBtn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <Text style={styles.headingTxt}>Privacy policy</Text>
            </View>


            <View style={styles.comp}>
                <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>
                    KLUNEST education is committed to protecting the privacy of its users. We do not sell or
                    rent user data to third parties. We may share your information with payment service
                    providers, regulatory authorities, and third-party agencies in the event of any request from
                    such authorities.
                </Text>


                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Shipping policy
                </Text>

                <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>
                    KLUNEST provides digital educational services, and most of our content is available online
                    through our mobile application. Since KLUNEST is an educational Android application
                    and does not involve physical product shipments.
                </Text>

                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Contact us
                </Text>

                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Email – infoklunest@gmail.com
                </Text>

                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Mobile no – 9702563808       8767170796
                </Text>

                <Text style={{ color: THEME_COLOR2, fontSize: 15, marginTop: 10 }}>
                    Cancellation and refund
                </Text>


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

export default Privacy
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
        marginLeft: moderateScale(80),
        color: THEME_COLOR2,
    },
    comp: {
        width: horizontalScale(300),
        // alignItems:'center',
        alignSelf: 'center',
        marginTop: 45
    }
})