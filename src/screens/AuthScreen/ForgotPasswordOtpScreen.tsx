import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomButton from '../../components/CustomButton';
import {Colors} from '../../theme/Colors';
import {Fonts} from '../../assets/Fonts';
import {FontSizes} from '../../theme/FontSizes';
import {AuthStackParamList} from '../../navigator/AuthStackNavigator';
import {useCustomAlert} from '../../components/useCustomAlertAllScreen';
import CustomAlert from '../../components/CustomAlertALLScreen';

type OtpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'NewSetPasswordScreen'
>;

type Props = {
  navigation: OtpScreenNavigationProp;
  route: {
    params: {
      contact: string;
      data: string;
    };
  };
};

const ForgotPasswordOtpScreen = ({navigation, route}: Props) => {
  const {contact, data} = route.params;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [confirm, setConfirm] = useState<any>(null);
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const {visible, alertConfig, showAlert, hideAlert} = useCustomAlert();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      try {
        sendOTP();
        setTimer(60);
      } catch (error) {}
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  const sendOTP = async () => {
    try {
      setIsResending(true);
      console.log(contact);
      const confirmation = await auth().signInWithPhoneNumber(contact);
      console.log('confirmation');
      setConfirm(confirmation);
      setIsResending(false);
    } catch (error) {
      showAlert({
        title: 'Error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send OTP. Please try again.',
        confirmText: 'OK',
        onConfirm: hideAlert,
      });
    }
  };

  const resendOtp = () => {
    sendOTP();
    setTimer(60);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const verifyOTP = async () => {
    if (!confirm) {
      showAlert({
        title: 'Error',
        message: 'OTP request timed out. Please resend.',
        confirmText: 'OK',
        onConfirm: hideAlert,
      });
      return;
    }

    const otpString = otp.join('');
    if (!/^\d{6}$/.test(otpString)) {
      showAlert({
        title: 'Invalid OTP',
        message: 'Please enter a valid 6-digit OTP',
        confirmText: 'OK',
        onConfirm: hideAlert,
      });

      return;
    }

    try {
      setIsLoading(true);
      await confirm.confirm(otpString);

      if (Platform.OS === 'android') {
        ToastAndroid.show('VERIFY DONE', ToastAndroid.LONG);
      } else if (Platform.OS === 'ios') {
        // Add iOS equivalent notification
        Alert.alert('Success', 'VERIFY DONE');
      }
      navigation.navigate('NewSetPasswordScreen', {data: data});
    } catch (error) {
      showAlert({
        title: 'Verification Failed',
        message:
          error instanceof Error
            ? error.message
            : 'Invalid OTP. Please try again.',
        confirmText: 'OK',
        onConfirm: hideAlert,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Validate input to only allow numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.otpText}>OTP Verification</Text>
          <Text style={styles.otpTextNamberShow}>
            OTP send this number : {contact.slice(3, 25)}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={value => handleOtpChange(index, value)}
                onKeyPress={({nativeEvent}) => {
                  if (
                    nativeEvent.key === 'Backspace' &&
                    digit === '' &&
                    index > 0
                  ) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.Yellow} />
          ) : (
            <CustomButton
              title="VERIFY OTP"
              buttonStyle={{backgroundColor: Colors.Yellow}}
              textStyle={{color: Colors.black}}
              onPress={verifyOTP}
            />
          )}
          <TouchableOpacity
            onPress={resendOtp}
            disabled={timer > 0 || isResending}>
            <Text
              style={[
                styles.resendText,
                (timer > 0 || isResending) && styles.resendTextDisabled,
              ]}>
              {isResending
                ? 'Sending...'
                : timer > 0
                ? `Resend OTP in ${timer}s`
                : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
        <CustomAlert
          visible={visible}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText={alertConfig.confirmText}
          onConfirm={alertConfig.onConfirm}
          onCancel={hideAlert}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor2,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  secondContainer: {
    backgroundColor: Colors.primaryColor,
    margin: responsiveScreenHeight(2),
    padding: responsiveScreenHeight(3),
    borderWidth: 1.5,
    borderColor: Colors.primaryColor1,
    borderRadius: 10,
  },
  otpText: {
    color: Colors.white,
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(1),
    textAlign: 'center',
    fontFamily: Fonts.ExtraBold,
  },
  otpContainer: {
    flexDirection: 'row',
    marginBottom: responsiveScreenHeight(2),
    justifyContent: 'center',
  },
  otpInput: {
    width: responsiveScreenWidth(11),
    height: responsiveScreenHeight(6),
    borderWidth: 1,
    borderColor: Colors.white,
    textAlign: 'center',
    color: Colors.black,
    fontSize: FontSizes.medium,
    borderRadius: 5,
    backgroundColor: Colors.white,
    marginHorizontal: responsiveScreenHeight(0.5),
  },
  resendText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: Fonts.SemiBold,
  },
  resendTextDisabled: {
    color: Colors.white,
    opacity: 0.5,
  },
  otpTextNamberShow: {
    color: Colors.white,
    textAlign: 'center',
    paddingBottom: 15,
  },
});

export default ForgotPasswordOtpScreen;
