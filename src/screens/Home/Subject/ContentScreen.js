import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, STUDENT_SUBSCRIPTION, SUBJECT_CHAPTERS } from '../../../constant/StringAPI';
import { FlatList } from 'react-native-gesture-handler';

const data = [
    {
        title: 'Introduction',
        subtitle: '1 video',
        icon: 'video',
        screen: 'IntroductionScreen',
    },
    {
        title: 'Chapter Summary',
        subtitle: 'Text/Voice',
        icon: 'file-document-outline',
        screen: 'ChapterSummaryScreen',
    },
    {
        title: 'Content Page (Topic wise)',
        subtitle: 'Text, Image, Video',
        icon: 'file-document-outline',
        screen: 'ContentPageScreen',
    },
    {
        title: 'Text Based Questions & Answers',
        subtitle: 'AI Agent powered',
        icon: 'comment-outline',
        screen: 'TextQuestionsScreen',
        isAI: true,
    },
    {
        title: 'AI Agent',
        subtitle: 'Macro & Micro, Conceptual Q',
        icon: 'robot-industrial-outline',
        screen: 'AIAgentScreen',
        isAI: true,
    },
    {
        title: 'Condition Based Quest',
        subtitle: 'AI Agent powered',
        icon: 'brain',
        screen: 'ConditionQuestScreen',
        isAI: true,
    },
    {
        title: 'Chapter Mind Map',
        subtitle: 'AI Agent powered',
        icon: 'map-outline',
        screen: 'MindMapScreen',
        isAI: true,
    },
];

const ContentScreen = ({ navigation, route }) => {
    const { id, name, studentChapterId, subjectId, valueitem } = route.params;
    console.log("ContentScreen head page...", route.params);
    const handleChapterClick = (item, index) => {

        if (index == 0) {
            const videoUrl = route.params.item['introduction'];
            if (videoUrl == null) {
                Alert.alert(
                    'Video not available',
                    'Video is not available for this chapter.',
                    [{ text: 'OK' }]
                );
                return;
            }
            const video_file = route.params.item['introduction']['video_file'];
            if (video_file == null) {
                Alert.alert(
                    'Video not available',
                    'Video is not available for this chapter.',
                    [{ text: 'OK' }]
                );
                return;
            }
            if (video_file) {
                navigation.navigate('WebViewScreen', { url: video_file, title: "Introduction" });
            }
        }

        else if (index == 1) {
            const summary_type = route.params.item['summary_type'];

            if (summary_type == 'text') {
                if (route.params.item['summary_text'] == null) {
                    Alert.alert(
                        'Summary not available',
                        'Text summary is not available for this chapter.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
                navigation.navigate('TextContentScreen', {
                    id,
                    name,
                    studentChaptId: studentChapterId,
                    subjectId,
                    item: route.params.item
                });
            }
            else if (summary_type == 'audio') {
                if (route.params.item['summary_audio_file'] == null) {
                    Alert.alert(
                        'Summary not available',
                        'audio summary is not available for this chapter.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
                navigation.navigate('WebViewScreen', { url: `${BASE_URL}${route.params.item['summary_audio_file']}`, title: "Audio Summary" });
            }
        } else if (index == 2) {
            if (route.params.item['topics'].length == 0) {
                Alert.alert(
                    'Topics not available',
                    'Topics is not available for this chapter.',
                    [{ text: 'OK' }]
                );
                return;
            }
            navigation.navigate('SubCategoryV2', { id: item.id, name: item.name, studentChaptId: studentChapterId, subjectId: route.params.id, item: route.params.item });
        }

        else if (index == 3) {
            const url = route.params.item['ai_text_based_qa'];
            console.log("Introduction Video URL:", url);
            if (url) navigation.navigate('WebViewScreen', { url });
        }

        else if (index == 4) {
            const url = route.params.item['ai_agent'];
            if (url) navigation.navigate('WebViewScreen', { url });
        }

        else if (index == 5) {
            const url = route.params.item['ai_condition_based_quest'];
            if (url) navigation.navigate('WebViewScreen', { url });
        }

        else if (index == 6) {
            const url = route.params.item['ai_chapter_mind_map'];
            if (url) navigation.navigate('WebViewScreen', { url });
        }
    };
    return (
        <View style={styles.container}>

            <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', alignItems: 'left' }}>
                    <Text style={styles.headingTxt}>Chapters</Text>
                    <Text style={styles.subHeadingTxt}>{name}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {data.map((item, index) => (
                    <TouchableOpacity
                        onPress={() => handleChapterClick(item, index)}
                        style={styles.viewChapter}
                    >
                        <View style={styles.iconContainer}>
                            <Icon name={item.icon} size={24} color="#444" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </View>
                        {item.isAI && (
                            <View style={styles.aiBadge}>
                                <Text style={{ color: '#004AAD', fontWeight: 'bold' }}>AI</Text>
                            </View>
                        )}
                        <Icon name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default ContentScreen;


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#009688', // teal green similar to your image's green
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    subjectText: {
        fontSize: 14,
        color: '#B2DFDB',
    },
    chapterText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 36,
        height: 36,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    aiBadge: {
        backgroundColor: '#D0E9FF',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginRight: 8,
    },

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
        fontWeight: 'bold',
        color: '#fff',
    },
    subHeadingTxt: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
    },

    heading: {
        width: horizontalScale(360),
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(12),
    }
}
);