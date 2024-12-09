import {StyleSheet} from 'react-native';
import React from 'react';
import FlashMessage from 'react-native-flash-message';

interface CustomFlashMessageProps {
  position: 'top' | 'bottom' | 'center';
}

const CustomFlashMessage: React.FC<CustomFlashMessageProps> = ({position}) => {
  return (
    <FlashMessage
      position={position}
      style={styles.flashMessageStyle}
      titleStyle={styles.titleStyle}
      textStyle={styles.textStyle}
    />
  );
};

export default CustomFlashMessage;

const styles = StyleSheet.create({
  flashMessageStyle: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    paddingVertical: 8,
  },
  titleStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 14,
  },
});
