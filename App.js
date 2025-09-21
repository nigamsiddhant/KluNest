








import { View, Text, Platform } from 'react-native'
import React, { useEffect } from 'react'
import MainNavigator from './src/navigation/MainNavigator'
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import DebugButton from './src/components/DebugButton';

const App = () => {

  useEffect(() => {
    // Test debugger
    console.log('🚀 App started - Debugger test');
    console.log('📱 Platform:', Platform.OS);
    console.log('🔧 Dev mode:', __DEV__);
    
    // Prevent the screen from going to sleep
    activateKeepAwake()

    // Cleanup when the component is unmounted or when the app goes to the background
    return () => {
      deactivateKeepAwake() // Optional: Reset to default behavior
    };
  }, []);

  return (
    <>
      {__DEV__ && <DebugButton />}
      <MainNavigator/>
    </>
  )
}

export default App