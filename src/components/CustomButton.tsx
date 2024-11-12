import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {Colors} from '../theme/Colors';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  buttonStyle,
  textStyle,
  ...touchableProps
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, buttonStyle]}
      {...touchableProps}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Yellow,
    marginVertical: responsiveScreenHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveScreenHeight(1.5),
    borderRadius: 5,
    width: '100%',
  },
  text: {
    color: Colors.black,
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Regular,
  },
});
