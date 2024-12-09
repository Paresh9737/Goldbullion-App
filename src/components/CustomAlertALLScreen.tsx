import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {Colors} from '../theme/Colors';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.alertContainer}>
              {/* Title Section */}
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
              </View>

              {/* Message Section */}
              {message && (
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{message}</Text>
                </View>
              )}

              {/* Buttons Section */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  activeOpacity={0.7}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                  activeOpacity={0.7}>
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryColor,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  messageContainer: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.textGrey,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.primaryColor2,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  confirmButton: {
    backgroundColor: Colors.primaryColor,
  },
  cancelButtonText: {
    color: Colors.Dark,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: Colors.primaryColor1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomAlert;
