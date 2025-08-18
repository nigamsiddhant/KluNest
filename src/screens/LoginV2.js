import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
import GradientContainer from '../components/GradientContainer'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { BASE_URL, LOGIN_USER, TEACHER_LOGIN } from '../constant/StringAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginV2 = ({ route }) => {
    const navigation = useNavigation();
    const { userType = 'student' } = route?.params || {};

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoding] = useState(false);

    const handleLogin = () => {
        console.log('Login attempt:', { email, password, userType });
        // Add login logic here
        LoginApi();
    };

    const LoginApi = async () => {
        setLoding(true);
        console.log('Login Api....');
        try {
            const params = {
                mobile: email,
                sw_password: password,
            };
            const headers = new Headers();

            headers.append('Content-Type', 'application/json');
            console.log('Login Api url....', `${BASE_URL}${userType === 'teacher' ? TEACHER_LOGIN : LOGIN_USER}`);
            const response = await axios.post(
                `${BASE_URL}${userType === 'teacher' ? TEACHER_LOGIN : LOGIN_USER}`,
                params,
                headers,
            );

            if (response?.data?.status === 200) {
                console.log('response success', response.data);
                // Alert.alert('Success', 'Login successful!');

                if (userType === 'teacher') {
                    AsyncStorage.setItem("TeacherData", JSON.stringify(response?.data?.teacher));
                    AsyncStorage.setItem("TeacherToken", response?.data?.teacher?.token);
                    AsyncStorage.setItem("TeacherId", JSON.stringify(response?.data?.teacher?.id));
                    AsyncStorage.setItem("TeacherName", response?.data?.teacher?.name);

                    const TeacherProfileUrl = `${BASE_URL}${response?.data?.teacher?.teacher_image}`;
                    AsyncStorage.setItem("TeacherProfileImg", TeacherProfileUrl);

                    navigation.navigate('TeacherTabNavigator', { screen: 'TeacherHome' });
                    return;
                }
                AsyncStorage.setItem('UserData', JSON.stringify(response?.data?.user));
                console.log('UserData--- : ', response.data.user);

                AsyncStorage.setItem('UserDataID', JSON.stringify(response?.data?.user.id));
                console.log('UserDataID--- : ', response.data.user.id);

                AsyncStorage.setItem('UserDataMobile', response?.data?.user.mobile);
                console.log('UserDataMobile--- : ', response.data.user.mobile);

                AsyncStorage.setItem('UserDataName', response?.data?.user.name);
                console.log('UserDataName--- : ', response.data.user.name);

                AsyncStorage.setItem('UserToken', response?.data?.user.token);
                console.log('Token--- : ', response.data.user.token);

                AsyncStorage.setItem('UserBoardID', JSON.stringify(response?.data?.user?.board_id));
                console.log('UserBoardID ---:', response?.data?.user?.board_id);

                AsyncStorage.setItem('UserClassID', JSON.stringify(response?.data?.user?.class_id));
                console.log('UserClassID ----', response?.data?.user?.class_id)

                AsyncStorage.setItem('ClassName', JSON.stringify(response?.data?.user?.class_name))
                console.log('ClassName----', response?.data?.user?.class_name)

                const imageUrl = `${BASE_URL}${response?.data?.user?.profile_image}`;
                console.log("profile Image url--->>>", imageUrl);

                AsyncStorage.setItem('StudentProfileImg', imageUrl)
                console.log('.........', imageUrl)


                setLoding(false);
                navigation.navigate('TabNavigator', { screen: 'HomePage' });
                return;
            }

            if (response?.data?.message) {
                console.log("In Vailid ----> ", response?.data?.message)
                // Alert.alert('Aleart',response?.data?.message)
                setMobileErrormessage('Invalid credentials!');
                setPasswordErrormessage('Invalid credentials!');
            }
        } catch (error) {
            Alert.alert('Login Error', 'Something went wrong. Please try again.');
        } finally {
            setLoding(false);
        }
    };


    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    const handleRegister = () => {
        navigation.navigate('SignupV2', { userType });
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
                    height={71}
                    viewBox={`0 0 ${width} 70`}
                    style={{ position: 'absolute', top: -70, zIndex: 10 }}
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

                <View style={styles.formContainer}>
                    <Text style={styles.loginTitle}>Login As {userType === 'teacher' ? 'Teacher' : 'Student'}</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Mobile Number"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                        <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.noAccountText}>Don't have an Account? </Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text style={styles.registerNowText}>Register Now!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GradientContainer >
    );
};

export default LoginV2;

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
    header: {
        position: 'absolute',
        top: verticalScale(50),
        left: horizontalScale(20),
        zIndex: 20,
    },
    backButton: {
        width: horizontalScale(40),
        height: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: moderateScale(20),
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: horizontalScale(30),
        justifyContent: 'space-between',
    },
    loginTitle: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: verticalScale(20),
        marginTop: verticalScale(10),
    },
    inputContainer: {
        marginBottom: verticalScale(15),
    },
    inputLabel: {
        fontSize: moderateScale(14),
        color: '#666666',
        marginBottom: verticalScale(8),
        fontWeight: '500',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: moderateScale(8),
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(12),
        fontSize: moderateScale(16),
        color: '#333333',
        backgroundColor: '#FAFAFA',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: moderateScale(8),
        backgroundColor: '#FAFAFA',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(12),
        fontSize: moderateScale(16),
        color: '#333333',
    },
    eyeButton: {
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(12),
    },
    eyeIcon: {
        fontSize: moderateScale(16),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(20),
        marginTop: verticalScale(5),
    },
    checkbox: {
        marginRight: horizontalScale(10),
    },
    checkboxBox: {
        width: horizontalScale(18),
        height: verticalScale(18),
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: moderateScale(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#2C3E50',
        borderColor: '#2C3E50',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: moderateScale(12),
        fontWeight: 'bold',
    },
    checkboxText: {
        fontSize: moderateScale(14),
        color: '#666666',
    },
    loginButton: {
        backgroundColor: '#2C3E50',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(15),
        borderRadius: moderateScale(8),
        marginBottom: verticalScale(15),
    },
    loginButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginRight: horizontalScale(10),
    },
    arrowIcon: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: '#00C896',
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginBottom: verticalScale(15),
        textDecorationLine: 'underline',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noAccountText: {
        fontSize: moderateScale(14),
        color: '#666666',
    },
    registerNowText: {
        fontSize: moderateScale(14),
        color: '#00C896',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});