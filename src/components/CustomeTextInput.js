import { View, Text, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { horizontalScale, moderateScale, verticalScale } from './responsive'
import { TextInput } from 'react-native-gesture-handler'
import { THEME_COLOR2 } from '../utils/Colors'

const CustomeTextInput = ({ mt, placeholder, onChangeText, isValid, keyboardType,secureTextEntry,
     value, editable, placeholderTextColor,  KeyboardAvoidingView, tabBarHideOnKeyboard, 
 maxLength   }) => {
    return (
        <View style={{
            width: horizontalScale(300), height: verticalScale(40), borderWidth: 1,
            borderColor: isValid ? '#9e9e9e' : 'red', backgroundColor: '#E9E9E9',
            alignSelf: 'center', borderRadius: 20, marginTop: mt ? mt : moderateScale(20),
            flexDirection: 'row', alignItems: 'center', paddingLeft: 15,
        }}>

            <TextInput
                style={{width:'80%',color:placeholder.includes('Mobile') ? THEME_COLOR2 : 'black'}}
                onChangeText={(txt) => {
                    onChangeText(txt);
                }}
                value={value}
                placeholder={placeholder} 
                keyboardType={keyboardType}
                editable={editable}
                placeholderTextColor
                KeyboardAvoidingView={KeyboardAvoidingView}
                tabBarHideOnKeyboard={tabBarHideOnKeyboard}
                secureTextEntry={secureTextEntry}
                maxLength={maxLength}
                
                />
            
        </View>
    )
}

export default CustomeTextInput
