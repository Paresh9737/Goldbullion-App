// import React from 'react';
// import {Modal, View, Text, StyleSheet} from 'react-native';
// import {Colors} from '../theme/Colors';
// import CustomButton from './CustomButton';
// import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

// interface CustomAlertProps {
//   visible: boolean;
//   message: string;
//   backgroundColor?: string;
//   textColor?: string;
//   buttonText?: string;
//   onClose: () => void;
// }

// const CustomAlert: React.FC<CustomAlertProps> = ({
//   visible,
//   message,
//   backgroundColor = '#610004',
//   textColor = '#fff',
//   buttonText = 'OK',
//   onClose,
// }) => {
//   return (
//     <Modal
//       transparent={true}
//       animationType="fade"
//       visible={visible}
//       onRequestClose={onClose}>
//       <View style={styles.overlay}>
//         <View style={[styles.alertContainer, {backgroundColor}]}>
//           <Text style={[styles.message, {color: textColor}]}>{message}</Text>
//           <CustomButton
//             title={buttonText}
//             onPress={onClose}
//             buttonStyle={styles.buttonStyle}
//             textStyle={styles.buttonTextStyle}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   alertContainer: {
//     width: '80%',
//     paddingVertical: 25,
//     paddingHorizontal: 15,
//     borderRadius: 15,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.Yellow,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   message: {
//     fontSize: responsiveScreenFontSize(2.5),
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 24,
//   },
//   buttonStyle: {
//     backgroundColor: Colors.Yellow,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   buttonTextStyle: {
//     color: Colors.black,
//     fontWeight: 'bold',
//   },
// });

// export default CustomAlert;

import React, {useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onUnlock: () => void;
  buttonText1?: string;
  exitApp?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onCancel,
  onUnlock,
  buttonText1,
  exitApp = false,
}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          if (exitApp) {
            BackHandler.exitApp();
            return true;
          }
          onCancel();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [visible, exitApp, onCancel]);

  const handleModalClose = React.useCallback(() => {
    if (exitApp) {
      BackHandler.exitApp();
    } else {
      onCancel();
    }
  }, [exitApp, onCancel]);
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleModalClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../assets/png/lock.png')}
            style={styles.icon}
            accessibilityLabel="Lock icon"
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleModalClose}
              accessibilityLabel="Cancel button"
              accessibilityRole="button">
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onUnlock}
              accessibilityLabel="Unlock button"
              accessibilityRole="button">
              <Text style={styles.unlockButton}>{buttonText1}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  icon: {
    width: responsiveScreenWidth(10),
    height: responsiveScreenHeight(7),
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: responsiveScreenHeight(1),
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#000',
    marginBottom: responsiveScreenHeight(2),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  cancelButton: {
    fontSize: 17,
    color: '#1976D2',
    fontWeight: '600',
  },
  unlockButton: {
    fontSize: 17,
    color: '#1976D2',
    fontWeight: '600',
    marginLeft: 20,
  },
});

export default CustomAlert;
