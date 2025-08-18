import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../../components/responsive';
import { THEME_COLOR, THEME_COLOR2 } from '../../../utils/Colors';
import CustomeTextInput from '../../../components/CustomeTextInput';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../../components/Loader';
import axios from 'axios';
import { BASE_URL, TEACHER_LOGIN } from '../../../constant/StringAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';

const TeacherLogin = () => {

    const navigation = useNavigation();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [MobileErrormessage, setMobileErrormessage] = useState('');
    const [PasswordErrormessage, setPasswordErrormessage] = useState('');

    const [loading, setLoading] = useState(false);

    // Validation function
    const validate = () => {
        let isValid = true;

        // Mobile validation
        if (mobile === '') {
            setMobileErrormessage('Please Enter Mobile Number');
            isValid = false;
        } else if (mobile.length < 10) {
            setMobileErrormessage('Please Enter 10 digit Number');
            isValid = false;
        } else if (mobile.length > 10) {
            setMobileErrormessage('Please Enter Exactly 10 digit Number');
            isValid = false;
        } else if (!/^\d+$/.test(mobile)) {
            setMobileErrormessage('Please Enter Only Numbers');
            isValid = false;
        } else {
            setMobileErrormessage('');
        }

        // Password validation
        if (password === '') {
            setPasswordErrormessage('Please Enter Password');
            isValid = false;
        } else if (password.length < 5) {
            setPasswordErrormessage('Please Enter Password minimum 5 digits');
            isValid = false;
        } else {
            setPasswordErrormessage('');
        }

        return isValid;
    };

    const TeacherLoginApi = async () => {
        setLoading(true);
        console.log("Teacher Login Api ====>");

        try {
            const params = {
                mobile: mobile,
                sw_password: password,
            };

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const response = await axios.post(
                `${BASE_URL}${TEACHER_LOGIN}`,
                params,
                headers,
            );

            console.log("Teacher data ----->> ", response.data);
            if (response?.data?.status === 200) {
                AsyncStorage.setItem("TeacherData", JSON.stringify(response?.data?.teacher));
                AsyncStorage.setItem("TeacherToken", response?.data?.teacher?.token);
                AsyncStorage.setItem("TeacherId", JSON.stringify(response?.data?.teacher?.id));
                AsyncStorage.setItem("TeacherName", response?.data?.teacher?.name);

                const TeacherProfileUrl = `${BASE_URL}${response?.data?.teacher?.teacher_image}`;
                AsyncStorage.setItem("TeacherProfileImg", TeacherProfileUrl);

                navigation.navigate('TeacherTabNavigator', { screen: 'TeacherHome' });
            }

            if (response?.data?.status === 400) {
                setMobileErrormessage(response?.data?.message);
                setPasswordErrormessage(response?.data?.message);
            }

        } catch (error) {
            Alert.alert('Login Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../images/cartoon.png')} style={styles.cartoon} />

            <ScrollView style={styles.bottomBox}>
                <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                    <Text style={styles.welcomeTxt}>Welcome to </Text>
                    <Text style={[styles.welcomeTxt, { color: THEME_COLOR }]}>
                        KLUnest
                    </Text>
                </View>

                <Text style={[styles.welcomeTxt, { color: THEME_COLOR2, textAlign: 'center' }]}>
                    Login As Teacher
                </Text>

                <Text style={styles.enter}>Mobile Number</Text>

                <CustomeTextInput
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    value={mobile}
                    maxLength={10}
                    // onChangeText={txt => {
                    //     const filteredText = txt.replace(/[^0-9]/g, '').slice(0, 10);
                    //     setMobile(filteredText);
                    // }}
                    onChangeText={txt => setMobile(txt)}
                    isValid={MobileErrormessage === '' ? true : false}
                />

                {MobileErrormessage !== '' && (
                    <Text style={styles.errorTxt}>{MobileErrormessage}</Text>
                )}

                {/* <Text style={styles.enter}>Password</Text> */}
                <View style={styles.passwordContainer}>
                    <CustomeTextInput
                        placeholder={'Enter Password'}
                        secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
                        value={password}
                        onChangeText={txt => setPassword(txt)}
                        isValid={PasswordErrormessage === '' ? true : false}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? 'visibility' : 'visibility-off'} // "eye" for show, "eye-off" for hide
                            size={24}
                            color="#000"
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>

                {PasswordErrormessage !== '' && (
                    <Text style={styles.errorTxt}>{PasswordErrormessage}</Text>
                )}

                <LinearGradient
                    colors={[THEME_COLOR, THEME_COLOR2]}
                    style={styles.LinearBtn}>
                    <TouchableOpacity
                        style={styles.LoginBtn}
                        onPress={() => {
                            const isValid = validate();
                            if (isValid) {
                                TeacherLoginApi();
                            }
                        }}>
                        <Text style={styles.LoginBtn}>Login</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                    }}>
                    <TouchableOpacity onPress={() => navigation.navigate('TeacherForgatPassword')}>
                        <Text style={styles.forgate}>Forgot Password ? </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('TeacherSignup');
                        }}>
                        <Text style={styles.forgate}> Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}>
                    <Text style={styles.forgate}>Login as </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('LoginInitialScreen')}>
                        <Text style={[styles.forgate, { color: THEME_COLOR2 }]}>Student</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
            <Loader visible={loading} />
        </View>
    );
}

export default TeacherLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cartoon: {
        width: horizontalScale(360),
        height: verticalScale(200),
        alignSelf: 'center',
    },

    bottomBox: {
        width: horizontalScale(355),
        height: verticalScale(500),
        marginTop: -5,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        alignSelf: 'center',
    },
    welcomeTxt: {
        fontSize: 25,
        fontWeight: '600',
        color: 'black',
    },

    LinearBtn: {
        width: horizontalScale(290),
        height: verticalScale(40),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: moderateScale(60),
    },

    LoginBtn: {
        width: '100%',
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    errorTxt: {
        color: 'red',
        marginLeft: moderateScale(30),
    },
    enter: {
        color: 'black',
        marginTop: 35,
        marginLeft: 40,
        marginBottom: -40,
    },
    forgate: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 32,
        marginTop: 10,
        justifyContent: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: -5,
    },
});
