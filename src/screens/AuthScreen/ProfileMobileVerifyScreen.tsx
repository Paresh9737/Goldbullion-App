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
import {DrawerParamList} from '../../navigator/DrawerNavigater';
import {editProfileUser} from '../../redux/AuthStackReducer/editProfileSlice';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {RootState} from '../../redux/store';
import {setUser} from '../../redux/userSlice';

type OtpScreenNavigationProp = StackNavigationProp<
  DrawerParamList,
  'ProfileMobileVerifyScreen'
>;
type ContactInfo = {
  mobile: string;
  email: string;
  address: string;
};
type Props = {
  navigation: OtpScreenNavigationProp;
  route: {
    params: {
      contact: ContactInfo;
    };
  };
};

const ProfileMobileVerifyScreen = ({navigation, route}: Props) => {
  const {contact} = route.params;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [confirm, setConfirm] = useState<any>(null);
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  // const navigation = useNavigation();

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
      console.log(contact);
      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + contact.mobile,
      );
      console.log('confirmation');
      setConfirm(confirmation);
      setIsResending(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
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
      Alert.alert('Error', 'Please request OTP first');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      await confirm.confirm(otpString);
      dispatch(
        editProfileUser({
          email: contact.email,
          country_code: '+91',
          mobile: contact.mobile,
          address: contact.address,
          id: user.id,
        }),
      );
      dispatch(
        setUser({
          email: contact.email,
          mobile: contact.mobile,
          address: contact.address,
          username: user.username,
          password: user.password,
          id: user.id,
        }),
      );
      ToastAndroid.show('Mobile Namber update', ToastAndroid.LONG);
      navigation.navigate('Logout');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
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
            OTP send this number : {contact.mobile}
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

export default ProfileMobileVerifyScreen;
