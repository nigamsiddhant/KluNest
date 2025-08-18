import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const GradientContainer = ({ 
  colors = ['#242E3D', '#1ABC9C'], 
  style, 
  children, 
  start = {x: 0, y: 0}, 
  end = {x: 0, y: 1} 
}) => {
  return (
    <LinearGradient 
      colors={colors} 
      style={style} 
      start={start} 
      end={end}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientContainer;