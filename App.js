








import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import MainNavigator from './src/navigation/MainNavigator'
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';

const App = () => {

  useEffect(() => {
    // Prevent the screen from going to sleep
    activateKeepAwake()

    // Cleanup when the component is unmounted or when the app goes to the background
    return () => {
      deactivateKeepAwake() // Optional: Reset to default behavior
    };
  }, []);

  return (
    <MainNavigator/>
  )
}

export default App