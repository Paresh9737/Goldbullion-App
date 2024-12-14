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
import {useAppDispatch} from '../../redux/hook';
import {registerUser} from '../../redux/AuthStackReducer/RegisterSlice';
import CustomAlert from '../../components/CustomAlertALLScreen';
import {useCustomAlert} from '../../components/useCustomAlertAllScreen';

type OtpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'OtpScreen'
>;

type Props = {
  navigation: OtpScreenNavigationProp;
  route: {
    params: {
      navigationData: any;
    };
  };
};

const OtpScreen = ({navigation, route}: Props) => {
  const {navigationData} = route.params;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [confirm, setConfirm] = useState<any>(null);
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const {visible, alertConfig, showAlert, hideAlert} = useCustomAlert();
  const dispatch = useAppDispatch();

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
        navigation.goBack(); // Navigate back when the back button is pressed
        return true; // Prevent default behavior (exiting the app)
      },
    );

    return () => backHandler.remove(); // Clean up the event listener on unmount
  }, [navigation]);

  const sendOTP = async () => {
    try {
      setIsResending(true);

      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + navigationData.mobile,
      );
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
      dispatch(
        registerUser({
          username: navigationData.username,
          password: navigationData.password,
          email: navigationData.email,
          mobile: navigationData.mobile,
          address: navigationData.address,
          country_code: '+91',
        }),
      ).unwrap();
      if (Platform.OS === 'android') {
        ToastAndroid.show('VERIFY DONE', ToastAndroid.LONG);
      } else if (Platform.OS === 'ios') {
        // Add iOS equivalent notification
        Alert.alert('Success', 'VERIFY DONE');
      }
      navigation.navigate('LoginScreen');
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
            OTP send this number : {navigationData.mobile.slice(0, 20)}
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
      </ScrollView>
      <CustomAlert
        visible={visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        onConfirm={alertConfig.onConfirm}
        onCancel={hideAlert}
      />
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

export default OtpScreen;

// import React, {useState, useEffect} from 'react';
// import {View, Text, TextInput, Button, Alert} from 'react-native';
// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {AuthStackParamList} from '../../navigator/AuthStackNavigator';
// import {useNavigation} from '@react-navigation/native';

// type OtpScreenNavigationProp = StackNavigationProp<
//   AuthStackParamList,
//   'OtpScreen'
// >;

// type Props = {
//   navigation: OtpScreenNavigationProp;
//   route: {
//     params: {
//       contact: string;
//     };
//   };
// };

// const OtpScreen = ({route}: Props) => {
//   const {contact} = route.params;
//   const [otp, setOtp] = useState('');

//   const [confirm, setConfirm] =
//     useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
//   const [timer, setTimer] = useState(60);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       try {
//         sendOtp();
//         setTimer(60);
//       } catch (error) {}
//     });

//     return unsubscribe;
//   }, [navigation]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (timer > 0) {
//         setTimer(timer - 1);
//       }
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [timer]);

//   const sendOtp = async () => {
//     try {
//       console.log(contact);
//       const confirmation = await auth().signInWithPhoneNumber(contact);
//       console.log('confirmation');
//       setConfirm(confirmation);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to send OTP. Please try again.');
//     }
//   };

//   const confirmOtp = async () => {
//     try {
//       if (confirm) {
//         await confirm.confirm(otp);
//         Alert.alert('Success', 'Phone number verified successfully!');
//         // Navigate to the next screen here
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Invalid OTP. Please try again.');
//     }
//   };

//   const resendOtp = () => {
//     sendOtp();
//     setTimer(60);
//   };

//   return (
//     <View style={{padding: 20}}>
//       <Text>Enter the OTP sent to {contact}</Text>
//       <TextInput
//         placeholder="Enter OTP"
//         value={otp}
//         onChangeText={setOtp}
//         keyboardType="numeric"
//         style={{
//           borderColor: '#000',
//           borderWidth: 1,
//           padding: 10,
//           marginVertical: 20,
//         }}
//       />
//       <Button title="Verify OTP" onPress={confirmOtp} />
//       <Text>Resend OTP in {timer} seconds</Text>
//       <Button title="Resend OTP" onPress={resendOtp} disabled={timer !== 0} />
//     </View>
//   );
// };

// export default OtpScreen;
