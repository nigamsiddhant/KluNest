// WebViewScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { horizontalScale, verticalScale, moderateScale } from '../../../components/responsive';

export default function WebViewScreen({ route, navigation }) {
    const { url, title } = route.params;
    //test
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            {/* Header Same as ContentScreen */}
            <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../../../images/BackBtn.png')}
                        style={styles.backBtn}
                    />
                </TouchableOpacity>

                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.headingTxt}>{title || "Content"}</Text>
                    {/* <Text style={styles.subHeadingTxt}>Web Viewer</Text> */}
                </View>
            </LinearGradient>

            {/* WebView */}
            <WebView
                source={{ uri: url }}
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: 'bold',
        color: '#fff',
    },
    subHeadingTxt: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
    },
});
