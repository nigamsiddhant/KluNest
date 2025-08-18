import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
import GradientContainer from '../components/GradientContainer'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { BASE_URL, REGISTER_USER, STUDENT_CLASS, TEACHER_REGISTER, TEACHER_SELECT_SUBJECT } from '../constant/StringAPI';
import { Picker } from '@react-native-picker/picker';
import { THEME_COLOR, THEME_COLOR2 } from '../utils/Colors';
import Loader from '../components/Loader';

const SignupV2 = ({ route }) => {
    const navigation = useNavigation();
    const { userType = 'student' } = route?.params || {};

    const [name, setName] = useState('');
    const [NameErrormessage, setNameErrormessage] = useState('');

    const [selectBoard, setSelectBoard] = useState(1);
    const [SelectBoardErrormessage, setSelectBoardErrormessage] = useState('');

    const [selectedClass, setSelectedClass] = useState('');
    const [SelectClassErrormessage, setSelectClassErrormessage] = useState('');
    const [selectedClassId, setSelectedClassId] = useState(null);

    const [mobile, setMobile] = useState('');
    const [MobileErrormessage, setMobileErrormessage] = useState('');

    const [school, setSchool] = useState('');
    const [SchoolErrormessage, setSchoolErrormessage] = useState('');

    // Teacher-specific fields
    const [email, setEmail] = useState('');
    const [EmailErrormessage, setEmailErrormessage] = useState('');

    const [qualification, setQualification] = useState('');
    const [QualificationErrormessage, setQualificationErrormessage] = useState('');

    const [subject, setSubject] = useState('');
    const [SubjectErrormessage, setSubjectErrormessage] = useState('');

    const [subjectData, setSubjectData] = useState([]);
    const [selectSubjectId, setSelectSubjectId] = useState(null);

    const [password, setPassword] = useState('');
    const [PasswordErrormessage, setPasswordErrormessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [swPassword, setSwPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [swPasswordErrormessage, setSwPasswordErrormessage] = useState('');

    const [classData, setClassData] = useState([]);
    const [loading, setLoding] = useState(false);

    useEffect(() => {
        if (userType === 'teacher') {
            console.log
            TeacherSubjectApi();
        } else {
            RegisterClassApi();
        }
    }, [userType]);

    const validate = () => {
        let isValid = false;

        if (name == '') {
            setNameErrormessage('Please Enter Name ');
            isValid = false;
        } else if (name != '') {
            setNameErrormessage('');
            isValid = true;
        }

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
            isValid = true;
        }

        if (userType === 'student') {
            if (school == '') {
                setSchoolErrormessage('Please Enter School Name');
                isValid = false;
            } else if (school != '') {
                setSchoolErrormessage('');
                isValid = true;
            }
        } else {
            // Teacher validations
            if (email === '') {
                setEmailErrormessage('Please Enter Email');
                isValid = false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                setEmailErrormessage('Please Enter a Valid Email');
                isValid = false;
            } else {
                setEmailErrormessage('');
                isValid = true;
            }

            if (qualification === '') {
                setQualificationErrormessage('Please Enter Qualification');
                isValid = false;
            } else {
                setQualificationErrormessage('');
                isValid = true;
            }

            if (subject === '') {
                setSubjectErrormessage('Please Select Teaching Subject');
                isValid = false;
            } else {
                setSubjectErrormessage('');
                isValid = true;
            }
        }

        if (password == '') {
            setPasswordErrormessage('Please Enter Password');
            isValid = false;
        } else if (password != '' && password.length < 5) {
            setPasswordErrormessage('Please Enter Password minimum 5 digit');
            isValid = false;
        } else if (password != '' && password.length > 4) {
            setPasswordErrormessage('');
            isValid = true;
        }

        if (swPassword == '') {
            setSwPasswordErrormessage('Please Re Enter Password');
            isValid = false;
        } else if (swPassword != '' && swPassword.length < 5) {
            setSwPasswordErrormessage('Please Re Enter password minimum 5 digit ');
            isValid = false;
        } else if (swPassword != '' && swPassword.length > 4) {
            setSwPasswordErrormessage('');
            isValid = true;
        }

        return isValid;
    };

    const handleClassChange = (itemValue) => {
        setSelectedClassId(itemValue);
        console.log('Selected Class ID:', itemValue);
    };

    const handleSubjectChange = (itemValue) => {
        setSelectSubjectId(itemValue);
        console.log('Selected Subject ID:', itemValue);
    };

    const handleSignup = () => {
        console.log('Signup attempt:', { name, mobile, password, userType });
        const isValid = validate();
        if (isValid) {
            RegisterApi();
        }
    };

    const RegisterApi = async () => {
        setLoding(true);
        console.log('Register Api....');
        try {
            let params, apiEndpoint;

            if (userType === 'teacher') {
                // Teacher registration params
                params = {
                    name: name,
                    mobile: mobile,
                    email: email,
                    qualification: qualification,
                    teaching_subject_id: selectSubjectId,
                    password: password,
                    sw_password: swPassword
                };
                apiEndpoint = `${BASE_URL}${TEACHER_REGISTER}`;
            } else {
                // Student registration params
                params = {
                    name: name,
                    board_id: selectBoard,
                    class_id: selectedClassId,
                    mobile: mobile,
                    school_name: school,
                    password: password,
                    sw_password: swPassword
                };
                apiEndpoint = `${BASE_URL}${REGISTER_USER}`;
            }

            console.log('Register params===', params);

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            const response = await axios.post(
                apiEndpoint,
                params,
                headers,
            );

            console.log('Registration Data -----', response.data);

            if (response?.data?.code === 200) {
                console.log('response success', response.data);
                Alert.alert('Success', 'Registration successful!');
                navigation.navigate('LoginV2', { userType });
                setLoding(false);
                return;
            }

            if (response?.data?.message) {
                Alert.alert('Alert', JSON.stringify(response?.data?.message));
                setMobileErrormessage(JSON.stringify(response?.data?.message?.mobile?.[0]) || '');
                setPasswordErrormessage(JSON.stringify(response?.data?.message?.password?.[0]) || '');
                setSwPasswordErrormessage(JSON.stringify(response?.data?.message?.sw_password?.[0]) || '');
                if (userType === 'teacher') {
                    setEmailErrormessage(JSON.stringify(response?.data?.message?.email?.[0]) || '');
                }
            }
        } catch (error) {
            Alert.alert('Registration Error', 'Something went wrong. Please try again.');
        } finally {
            setLoding(false);
        }
    };

    const RegisterClassApi = async () => {
        setLoding(true);
        console.log('Register class Api.....');
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            const apiUrl = `${BASE_URL}${STUDENT_CLASS}`;
            console.log('Full API URL:', apiUrl);

            const response = await axios.get(apiUrl, { headers });

            console.log('Class Data...', response.data.data);
            setClassData(response?.data?.data);
        } catch (error) {
            console.error('Error registering class:', error.message || error);
        } finally {
            setLoding(false);
        }
    };

    const TeacherSubjectApi = async () => {
        setLoding(true);
        console.log('Teacher Subject Api.....');
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            const apiUrl = `${BASE_URL}${TEACHER_SELECT_SUBJECT}`;
            console.log('Teacher Subject API URL:', apiUrl);

            const response = await axios.get(apiUrl, { headers });

            console.log('Subject Data...', response.data.data);
            setSubjectData(response?.data?.data);
        } catch (error) {
            console.error('Error fetching subjects:', error.message || error);
        } finally {
            setLoding(false);
        }
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

                <ScrollView
                    style={styles.formContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    <Text style={styles.loginTitle}>SignUp As {userType === 'teacher' ? 'Teacher' : 'Student'}</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                            placeholderTextColor="#999"
                        />
                        {NameErrormessage != '' && <Text style={styles.errorTxt}>{NameErrormessage}</Text>}
                    </View>

                    {userType === 'student' && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Board</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectBoard}
                                        onValueChange={(itemValue) => {
                                            setSelectBoard(itemValue);
                                            console.log('value====', itemValue);
                                        }}
                                    >
                                        <Picker.Item label="CBSE Board" value={1} />
                                        <Picker.Item label="State Board" value={2} />
                                    </Picker>
                                </View>
                                {SelectBoardErrormessage != '' && (
                                    <Text style={styles.errorTxt}>{SelectBoardErrormessage}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Class</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedClassId}
                                        onValueChange={handleClassChange}
                                    >
                                        <Picker.Item label="Please select a class" value={null} />
                                        {classData.map((item) => (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        ))}
                                    </Picker>
                                </View>
                                {SelectClassErrormessage != '' && (
                                    <Text style={styles.errorTxt}>{SelectClassErrormessage}</Text>
                                )}
                            </View>
                        </>
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Mobile Number</Text>
                        <TextInput
                            style={styles.textInput}
                            value={mobile}
                            onChangeText={setMobile}
                            placeholder="Mobile Number"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            maxLength={10}
                        />
                        {MobileErrormessage != '' && <Text style={styles.errorTxt}>{MobileErrormessage}</Text>}
                    </View>

                    {userType === 'student' ? (
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>School</Text>
                            <TextInput
                                style={styles.textInput}
                                value={school}
                                onChangeText={setSchool}
                                placeholder="School"
                                placeholderTextColor="#999"
                            />
                            {SchoolErrormessage != '' && <Text style={styles.errorTxt}>{SchoolErrormessage}</Text>}
                        </View>
                    ) : (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {EmailErrormessage != '' && <Text style={styles.errorTxt}>{EmailErrormessage}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Qualification</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={qualification}
                                    onChangeText={setQualification}
                                    placeholder="Qualification"
                                    placeholderTextColor="#999"
                                />
                                {QualificationErrormessage != '' && <Text style={styles.errorTxt}>{QualificationErrormessage}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Teaching Subject</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectSubjectId}
                                        onValueChange={handleSubjectChange}
                                    >
                                        <Picker.Item label="Please select a subject" value={null} />
                                        {subjectData.map((item) => (
                                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                                        ))}
                                    </Picker>
                                </View>
                                {SubjectErrormessage != '' && (
                                    <Text style={styles.errorTxt}>{SubjectErrormessage}</Text>
                                )}
                            </View>
                        </>
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter Password"
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
                        {PasswordErrormessage != '' && (
                            <Text style={styles.errorTxt}>{PasswordErrormessage}</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={swPassword}
                                onChangeText={setSwPassword}
                                placeholder="Confirm Password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                        {swPasswordErrormessage != '' && (
                            <Text style={styles.errorTxt}>{swPasswordErrormessage}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleSignup}
                    >
                        <Text style={styles.loginButtonText}>Sign Up</Text>
                        <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.noAccountText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginV2', { userType })}>
                            <Text style={styles.registerNowText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <Loader visible={loading} />
            </View>
        </GradientContainer>
    );
};

export default SignupV2;

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
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(20),
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
        paddingHorizontal: horizontalScale(20),
        paddingTop: verticalScale(30),
    },
    scrollContentContainer: {
        paddingBottom: verticalScale(40),
        flexGrow: 1,
    },
    loginTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: verticalScale(15),
        marginTop: verticalScale(5),
    },
    inputContainer: {
        marginBottom: verticalScale(10),
        width: '100%',
    },
    inputLabel: {
        fontSize: moderateScale(13),
        color: '#666666',
        marginBottom: verticalScale(5),
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
    passwordInput: {
        flex: 1,
        paddingHorizontal: horizontalScale(10),
        paddingVertical: verticalScale(12),
        fontSize: moderateScale(16),
        color: '#333333',
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
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(8),
        marginTop: verticalScale(15),
        marginBottom: verticalScale(10),
        width: '100%',
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
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
        paddingHorizontal: horizontalScale(20),
        backgroundColor: '#F8F9FA',
        paddingVertical: verticalScale(15),
        borderRadius: moderateScale(8),
    },
    noAccountText: {
        fontSize: moderateScale(15),
        color: '#2C3E50',
        fontWeight: '500',
    },
    registerNowText: {
        fontSize: moderateScale(15),
        color: '#00C896',
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginLeft: horizontalScale(5),
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: moderateScale(8),
        backgroundColor: '#FAFAFA',
        marginBottom: verticalScale(5),
        height: verticalScale(50),
        justifyContent: 'center',
        paddingHorizontal: horizontalScale(10),
    },
    errorTxt: {
        color: 'red',
        fontSize: moderateScale(11),
        marginTop: verticalScale(2),
        marginBottom: verticalScale(5),
        marginLeft: horizontalScale(5),
    },
});