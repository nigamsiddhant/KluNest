import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '../components/responsive'
import GradientContainer from '../components/GradientContainer'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import Svg, { Path } from 'react-native-svg';
const Walkthrough = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('Unlock Your Potential with KLUnest');
  const [clickCount, setClickCount] = useState(0);
  const [imageSrc, setImageSrc] = useState(require('../images/user_example_image.png'));

  const handleNext = () => {
    if (clickCount === 0) {
      setTitle('Empower Your Education Journey ');
      setImageSrc(require('../images/user_example_image2.png'));
      setClickCount(1);
    } else {
      // navigation.navigate('Login');
      navigation.navigate('LoginInitialScreen');
    }
  };
  return (
    <GradientContainer style={styles.container}>
      <View>
        <Image
          source={imageSrc}
          style={{ width: width, height: height * 0.46, resizeMode: 'contain' }}
        />
      </View>
      {/* Bottom Content */}
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

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          A handful of model sentence structures, too generate Lorem which looks reason able.
        </Text>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Image
            source={require('../images/walkthrought_button_1.png')}
          />
        </TouchableOpacity>

      </View>
    </GradientContainer >
  );
};

export default Walkthrough;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bottomContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingHorizontal: horizontalScale(30),
    paddingVertical: verticalScale(40),
    height: height * 0.54,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: verticalScale(5),
  },
  subtitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  description: {
    fontSize: moderateScale(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  }
});