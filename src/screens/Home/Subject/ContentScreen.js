// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For icons
// // import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LinearGradient from 'react-native-linear-gradient';
// import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
// import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
// import { useNavigation } from '@react-navigation/native';

// const data = [
//     {
//         title: 'Introduction',
//         subtitle: '1 video',
//         icon: 'video',
//         screen: 'IntroductionScreen',
//     },
//     {
//         title: 'Chapter Summary',
//         subtitle: 'Text/Voice',
//         icon: 'file-document-outline',
//         screen: 'ChapterSummaryScreen',
//     },
//     {
//         title: 'Content Page (Topic wise)',
//         subtitle: 'Text, Image, Video',
//         icon: 'file-document-outline',
//         screen: 'ContentPageScreen',
//     },
//     {
//         title: 'Text Based Questions & Answers',
//         subtitle: 'AI Agent powered',
//         icon: 'comment-outline',
//         screen: 'TextQuestionsScreen',
//         isAI: true,
//     },
//     {
//         title: 'AI Agent',
//         subtitle: 'Macro & Micro, Conceptual Q',
//         icon: 'robot-industrial-outline',
//         screen: 'AIAgentScreen',
//         isAI: true,
//     },
//     {
//         title: 'Condition Based Quest',
//         subtitle: 'AI Agent powered',
//         icon: 'brain',
//         screen: 'ConditionQuestScreen',
//         isAI: true,
//     },
//     {
//         title: 'Chapter Mind Map',
//         subtitle: 'AI Agent powered',
//         icon: 'map-outline',
//         screen: 'MindMapScreen',
//         isAI: true,
//     },
// ];

// function ContentScreen({ navigation, route }) {
//     const id = route?.params?.id ?? null;
//     const name = route?.params?.name ?? "";
//     console.log("ContentScreen head page...", route.params);
//     return (
//         <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
//             <LinearGradient colors={['#263755', '#1ABC9C']} style={styles.heading}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Image source={require('../../../images/BackBtn.png')} style={styles.backBtn} />
//                 </TouchableOpacity>
//                 <Text style={styles.headingTxt}>Chapters {name} {id}</Text>
//             </LinearGradient>
//             <ScrollView contentContainerStyle={{ padding: 20 }}>
//                 {data.map((item, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={styles.card}
//                         onPress={() => navigation.navigate(item.screen)}
//                     >
//                         <View style={styles.iconContainer}>
//                             <Icon name={item.icon} size={24} color="#444" />
//                         </View>
//                         <View style={{ flex: 1 }}>
//                             <Text style={styles.title}>{item.title}</Text>
//                             <Text style={styles.subtitle}>{item.subtitle}</Text>
//                         </View>
//                         {item.isAI && (
//                             <View style={styles.aiBadge}>
//                                 <Text style={{ color: '#004AAD', fontWeight: 'bold' }}>AI</Text>
//                             </View>
//                         )}
//                         <Icon name="chevron-right" size={24} color="#ccc" />
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// }

// // Dummy screens for redirection
// function IntroductionScreen() {
//     return <ScreenTemplate title="Introduction Screen" />;
// }
// function ChapterSummaryScreen() {
//     const navigation = useNavigation();
//     return navigation.navigate('ContentScreen', { id: id, name: name });
// }
// function ContentPageScreen() {
//     return <ScreenTemplate title="Content Page Screen" />;
// }
// function TextQuestionsScreen() {
//     return <ScreenTemplate title="Text Based Questions & Answers Screen" />;
// }
// function AIAgentScreen() {
//     return <ScreenTemplate title="AI Agent Screen" />;
// }
// function ConditionQuestScreen() {
//     return <ScreenTemplate title="Condition Based Quest Screen" />;
// }
// function MindMapScreen() {
//     return <ScreenTemplate title="Chapter Mind Map Screen" />;
// }

// function ScreenTemplate({ title }) {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text style={{ fontSize: 22 }}>{title}</Text>
//         </View>
//     );
// }

// const Stack = createStackNavigator();

// export default function App() {
//     return (
//         // <NavigationContainer>
//         <Stack.Navigator
//             initialRouteName="Home"
//             screenOptions={{ headerShown: false }}
//         >
//             <Stack.Screen name="Home" component={ContentScreen} />
//             <Stack.Screen name="IntroductionScreen" component={IntroductionScreen} />
//             <Stack.Screen name="ChapterSummaryScreen" component={ChapterSummaryScreen} />
//             <Stack.Screen name="ContentPageScreen" component={ContentPageScreen} />
//             <Stack.Screen name="TextQuestionsScreen" component={TextQuestionsScreen} />
//             <Stack.Screen name="AIAgentScreen" component={AIAgentScreen} />
//             <Stack.Screen name="ConditionQuestScreen" component={ConditionQuestScreen} />
//             <Stack.Screen name="MindMapScreen" component={MindMapScreen} />
//         </Stack.Navigator>
//         // </NavigationContainer>
//     );
// }

// const styles = StyleSheet.create({
//     header: {
//         backgroundColor: '#009688', // teal green similar to your image's green
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     subjectText: {
//         fontSize: 14,
//         color: '#B2DFDB',
//     },
//     chapterText: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#fff',
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         paddingVertical: 18,
//         paddingHorizontal: 16,
//         marginBottom: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowOffset: { width: 0, height: 2 },
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     iconContainer: {
//         width: 36,
//         height: 36,
//         backgroundColor: '#F1F5F9',
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontWeight: '700',
//         fontSize: 16,
//         color: '#111827',
//     },
//     subtitle: {
//         fontSize: 12,
//         color: '#6B7280',
//         marginTop: 2,
//     },
//     aiBadge: {
//         backgroundColor: '#D0E9FF',
//         borderRadius: 8,
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         marginRight: 8,
//     },

//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     heading: {
//         width: horizontalScale(360),
//         height: verticalScale(50),
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: moderateScale(12),
//         backgroundColor: '#E9E9E9',
//         text: 'center',
//     },
//     backBtn: {
//         width: horizontalScale(25),
//         height: verticalScale(20),
//         resizeMode: 'contain',
//         marginTop: moderateScale(10),
//     },
//     scienceTxt: {
//         fontSize: 22,
//         fontWeight: '700',
//         alignSelf: 'center',
//         marginLeft: moderateScale(70),
//         color: THEME_COLOR2,
//     },
//     ChapterTxt: {
//         fontSize: 22,
//         fontWeight: '700',
//         color: '#1ABC9C',
//     },
//     viewChapter: {
//         width: horizontalScale(330),
//         backgroundColor: '#FFFFFF',
//         borderRadius: moderateScale(15),
//         flexDirection: 'row',
//         padding: 15,
//         margin: 10,
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         alignSelf: 'center',
//         elevation: 5,
//     },
//     // openBtn1: {
//     //   width: horizontalScale(70),
//     //   height: verticalScale(30),
//     //   backgroundColor: THEME_COLOR,
//     //   justifyContent: 'center',
//     //   alignItems: 'center',
//     //   borderRadius: 20,
//     //   elevation: 10,
//     // },
//     openBtn: {
//         backgroundColor: '#1ABC9C',
//         width: horizontalScale(70),
//         height: verticalScale(30),
//         borderRadius: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     lockedContainer: {
//         width: horizontalScale(70),
//         height: verticalScale(30),
//         backgroundColor: 'gray',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 20,
//         elevation: 10,
//     },

//     backBtn: {
//         width: horizontalScale(25),
//         height: verticalScale(20),
//         resizeMode: 'contain',
//         tintColor: 'white',
//         alignSelf: 'center',
//     },

//     headingTxt: {
//         fontSize: 18,
//         fontWeight: '600',
//         alignSelf: 'center',
//         color: 'white',
//     },

//     heading: {
//         width: horizontalScale(360),
//         height: verticalScale(60),
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: moderateScale(12),
//     }

// }
// );

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
            const videoUrl = route.params.item['introduction']['video_file'];   // <-- your video URL key
            if (videoUrl) {
                Linking.openURL(videoUrl);
            } else {
                console.log("No video URL found");
            }
        } else if (index == 1) {
            const summary_type = route.params.item['summary_type'];   // <-- your video URL key
            if (summary_type == 'text') {
                navigation.navigate('TextContentScreen', { id: id, name: name, studentChaptId: studentChapterId, subjectId: subjectId, item: route.params.item });
            } else if (summary_type == 'audio') {
                Linking.openURL(route.params.item['summary_audio_file']);
            }
            //text file
        } else if (index == 2) {
            navigation.navigate('SubCategoryV2', { id: id, name: name, studentChaptId: studentChapterId, subjectId: subjectId, item: route.params.item });
        } else if (index == 3) {
            const videoUrl = route.params.item['ai_text_based_qa'];   // <-- your video URL key
            if (videoUrl) {
                Linking.openURL(videoUrl);
            } else {
                console.log("No video URL found");
            }
        } else if (index == 4) {
            const videoUrl = route.params.item['ai_agent'];   // <-- your video URL key
            if (videoUrl) {
                Linking.openURL(videoUrl);
            } else {
                console.log("No video URL found");
            }
        } else if (index == 5) {
            const videoUrl = route.params.item['ai_condition_based_quest'];   // <-- your video URL key
            if (videoUrl) {
                Linking.openURL(videoUrl);
            } else {
                console.log("No video URL found");
            }
        } else if (index == 6) {
            const videoUrl = route.params.item['ai_chapter_mind_map'];   // <-- your video URL key
            if (videoUrl) {
                Linking.openURL(videoUrl);
            } else {
                console.log("No video URL found");
            }
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