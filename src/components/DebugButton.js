import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const DebugButton = () => {
  const openDebugMenu = () => {
    NativeModules.DevMenu.show();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openDebugMenu}>
      <Text style={styles.text}>Debug</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DebugButton;