//import liraries
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Text, StyleSheet} from 'react-native';

const Timer = ({style}) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });

  return <DisplayTime style={style} milliseconds={currentTime * 1000} />;
};

const DisplayTime = ({style,milliseconds}) => {
  const [duration, setDuration] = useState('00:00:00');

  const addPad = num => {
    return String(num).padStart(2, '0');
  };

  useEffect(() => {
    var time = moment.duration(milliseconds, 'milliseconds');
    const hours = time.hours();
    const minutes = time.minutes();
    const seconds = time.seconds();
    if (hours > 0) {
      setDuration(`${addPad(hours)}:${addPad(minutes)}:${addPad(seconds)}`);
    } else {
      setDuration(`${addPad(minutes)}:${addPad(seconds)}`);
    }
  }, [milliseconds]);

  return <Text style={[style]}>{duration}</Text>;
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default Timer;
