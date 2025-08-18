import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
import GradientContainer from '../components/GradientContainer'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import Svg, { Path } from 'react-native-svg';

const LoginInitialScreen = () => {
    const navigation = useNavigation();

    const handleTeacherLogin = () => {
        navigation.navigate('LoginV2', { userType: 'teacher' });
    };

    const handleStudentLogin = () => {
        navigation.navigate('LoginV2', { userType: 'student' });
    };

    const handleTeacherRegister = () => {
        navigation.navigate('SignupV2', { userType: 'teacher' });
    };

    const handleStudentRegister = () => {
        navigation.navigate('SignupV2', { userType: 'student' });
    };

    return (
        <GradientContainer style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../images/kl_icon.png')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.bottomContent}>
                <Svg
                    width={width}
                    height={70}
                    viewBox={`0 0 ${width} 70`}
                    style={{ position: 'absolute', top: -69, zIndex: 10 }}
                >
                    <Path
                        d={`
      M0,70 
      C ${width * 0.25},0 ${width * 0.75},0 ${width},70 
      Z
    `}
                        fill="#ffffff"
                    />
                </Svg>

                <Text style={styles.welcomeTitle}>Welcome to KLUnest</Text>

                <Text style={styles.description}>
                    A handful of model sentence structures, too generate Lorem which looks reason able.
                </Text>

                <Text style={styles.loginAsText}>Login as a</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.teacherButton} onPress={handleTeacherLogin}>
                        <Text style={styles.teacherButtonText}>Teacher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.studentButton} onPress={handleStudentLogin}>
                        <Text style={styles.studentButtonText}>Student</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.registerText}>Don't have account? then register as</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.teacherButton} onPress={handleTeacherRegister}>
                        <Text style={styles.teacherButtonText}>Teacher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.studentButton} onPress={handleStudentRegister}>
                        <Text style={styles.studentButtonText}>Student</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </GradientContainer >
    );
};

export default LoginInitialScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: verticalScale(50),
    },
    logo: {
        width: horizontalScale(80),
        height: verticalScale(80),
        resizeMode: 'contain',
        marginBottom: verticalScale(10),
    },
    versionText: {
        fontSize: moderateScale(12),
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(5),
        borderRadius: moderateScale(10),
        overflow: 'hidden',
    },
    bottomContent: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingHorizontal: horizontalScale(30),
        paddingVertical: verticalScale(40),
        height: height * 0.65,
        alignItems: 'center',
        position: 'relative',
    },
    welcomeTitle: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: verticalScale(10),
        marginTop: verticalScale(20),
    },
    description: {
        fontSize: moderateScale(14),
        color: '#666666',
        textAlign: 'center',
        lineHeight: moderateScale(20),
        marginBottom: verticalScale(30),
        paddingHorizontal: horizontalScale(20),
    },
    loginAsText: {
        fontSize: moderateScale(16),
        color: '#333333',
        textAlign: 'center',
        marginBottom: verticalScale(15),
        fontWeight: '500',
    },
    registerText: {
        fontSize: moderateScale(14),
        color: '#666666',
        textAlign: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(15),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: horizontalScale(20),
        marginBottom: verticalScale(10),
    },
    teacherButton: {
        backgroundColor: '#00C896',
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(30),
        borderRadius: moderateScale(25),
        flex: 0.45,
        alignItems: 'center',
    },
    teacherButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    studentButton: {
        backgroundColor: '#2C3E50',
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(30),
        borderRadius: moderateScale(25),
        flex: 0.45,
        alignItems: 'center',
    },
    studentButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});