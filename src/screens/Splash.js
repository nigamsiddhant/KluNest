import { View, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { THEME_COLOR, THEME_COLOR2 } from '../utils/Colors'
import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
import LinearGradient from 'react-native-linear-gradient'
import GradientContainer from '../components/GradientContainer'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      handleGetStarted();
    }, 3000);
  }, []);

  const handleGetStarted = async () => {
    try {

      const Token = await AsyncStorage.getItem('UserToken');
      const TeacherToken = await AsyncStorage.getItem('TeacherToken');


      console.log('UserToken:', Token);
      console.log('TeacherToken:', TeacherToken);


      if (!Token && !TeacherToken) {

        navigation.replace('Walkthrough');
      } else if (Token) {

        navigation.replace('TabNavigator');
      } else if (TeacherToken) {

        navigation.replace('TeacherTabNavigator');
      }
    } catch (error) {
      console.error('Error retrieving token', error);

      navigation.replace('Walkthrough');
    }
  };

  return (
    <GradientContainer style={styles.container}>
      {/* Static Icons */}
      <View style={[styles.floatingIcon, { top: '10%', left: '15%' }]}>
        <Image source={require('../images/book_icon.png')} style={styles.iconSmall} />
      </View>

      <View style={[styles.floatingIcon, { top: '15%', right: '10%' }]}>
        <Image source={require('../images/A_plus.png')} style={styles.iconSmall} />
      </View>

      <View style={[styles.floatingIcon, { top: '30%', left: '5%' }]}>
        <Image source={require('../images/react_icon.png')} style={styles.iconSmall} />
      </View>

      <View style={[styles.floatingIcon, { top: '25%', right: '20%' }]}>
        <Image source={require('../images/master_icon.png')} style={styles.iconSmall} />
      </View>

      <View style={[styles.floatingIcon, { bottom: '30%', left: '10%' }]}>
        <Image source={require('../images/disk_icon.png')} style={styles.iconSmall} />
      </View>

      <View style={[styles.floatingIcon, { bottom: '15%', right: '15%' }]}>
        <Image source={require('../images/reward_icon.png')} style={styles.iconSmall} />
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <Image source={require('../images/klunest_img.png')} style={styles.mainLogo} />
      </View>
    </GradientContainer>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLogo: {
    width: horizontalScale(120),
    height: verticalScale(120),
    resizeMode: 'contain',
    marginBottom: verticalScale(20),
  },
  appName: {
    fontSize: moderateScale(32),
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  floatingIcon: {
    position: 'absolute',
  },
  iconSmall: {
    height: 54,
    width: 54,
  },
});
