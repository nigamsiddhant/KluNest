import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, STUDENT_SUBSCRIPTION, SUBJECT_CHAPTERS } from '../../../constant/StringAPI';
import { FlatList } from 'react-native-gesture-handler';

const TextContentScreen = ({ navigation, route }) => {
    const { id, name } = route.params;
    console.log("siddhant head page...", route.params.item);
    console.log("topics data:", route.params.item?.topics);

    return (
        <View style={styles.container}>

            <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <Text style={styles.headingTxt}>Topics</Text>
            </LinearGradient>



            <Text style={styles.ChapterTxt}>{route.params.item['summary_text']}</Text>
        </View>
    );
};

export default TextContentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    heading: {
        width: horizontalScale(360),
        height: verticalScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(12),
        backgroundColor: '#E9E9E9',
        text: 'center',
    },
    backBtn: {
        width: horizontalScale(25),
        height: verticalScale(20),
        resizeMode: 'contain',
        marginTop: moderateScale(10),
    },
    scienceTxt: {
        fontSize: 22,
        fontWeight: '700',
        alignSelf: 'center',
        marginLeft: moderateScale(70),
        color: THEME_COLOR2,
    },
    ChapterTxt: {
        margin: 10,
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
    },
    viewChapter: {
        width: horizontalScale(330),
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(15),
        flexDirection: 'row',
        padding: 15,
        margin: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
    },
    // openBtn1: {
    //   width: horizontalScale(70),
    //   height: verticalScale(30),
    //   backgroundColor: THEME_COLOR,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   borderRadius: 20,
    //   elevation: 10,
    // },
    openBtn: {
        backgroundColor: '#1ABC9C',
        width: horizontalScale(70),
        height: verticalScale(30),
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockedContainer: {
        width: horizontalScale(70),
        height: verticalScale(30),
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        elevation: 10,
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

    heading: {
        width: horizontalScale(360),
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(12),
    }
});
