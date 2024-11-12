import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Colors} from '../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';

interface InputFieldProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle; // Add a new prop for additional input styles
}

const InputField: React.FC<InputFieldProps> = ({
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle, // Destructure the new prop
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <TextInput
        style={[styles.textInput, inputStyle]} // Merge the styles
        {...textInputProps}
      />
      {rightIcon && (
        <TouchableOpacity style={styles.iconContainer}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenHeight(1),
    marginVertical: responsiveScreenHeight(1),
    height: responsiveScreenHeight(5),
  },
  textInput: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 0,
    fontSize: FontSizes.medium,
    paddingLeft: responsiveScreenHeight(1),
    fontFamily: Fonts.Regular,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(6),
  },
});
