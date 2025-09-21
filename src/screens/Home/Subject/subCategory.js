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

const SubCategoryV2 = ({ navigation, route }) => {
    const { id, name } = route.params;
    console.log("siddhant head page...", route.params.item);
    console.log("topics data:", route.params.item?.topics);
    if (route.params.item?.topics) {
        route.params.item.topics.forEach((topic, index) => {
            console.log(`Topic ${index}:`, topic);
            console.log(`Topic ${index} questions:`, topic.questions);
        });
    }
    const [chaptersData, setChaptersData] = useState([]);
    const [loading, setLoding] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(false); // State to store payment status
    const [studentChapterId, setStudentChapterId] = useState([]);





    const Chapter = ({ navigation, item, index }) => {
        const handleChapterClick = (item, index) => {

            console.log("wtf man......", item);
            navigation.navigate('Quiz', { id: item.id, name: item.name, studentChaptId: studentChapterId, subjectId: route.params.id, item: route.params.item, indexSelected: index });
            console.log("chapter.......id", item.id);

        };

        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => handleChapterClick(item, index)}
                    style={styles.viewChapter}
                >
                    <View style={{ width: '75%' }}>
                        <Text style={{ fontSize: 20, margin: 1, color: 'black' }}>
                            {item.name}
                        </Text>
                    </View>

                    {item.questions && item.questions.length > 0 ? ( // If payment is done or it's the first chapter
                        <View

                            style={styles.openBtn}
                        >
                            <Text style={{ fontSize: 16, color: 'white' }}>Open</Text>
                        </View>
                    ) : (
                        <View style={styles.lockedContainer}>
                            {/* Add your lock icon or text */}
                            <Text style={{ fontSize: 16, color: 'black' }}>Locked</Text>
                        </View>
                    )}
                </TouchableOpacity>


            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
        </TouchableOpacity>
        <Text style={styles.scienceTxt}>{name} Chapters</Text>
      </View> */}

            <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <Text style={styles.headingTxt}>  Topics</Text>
            </LinearGradient>



            <FlatList
                data={route.params.item['topics']}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => <Chapter navigation={navigation} item={item} index={index} />}
                ListEmptyComponent={<Text>No data available</Text>}
                contentContainerStyle={{ padding: 1 }}
            />
        </View>
    );
};

export default SubCategoryV2;

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
        fontSize: 22,
        fontWeight: '700',
        color: '#1ABC9C',
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
