import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../theme/Colors';
import {FontSizes} from '../../theme/FontSizes';
import {Fonts} from '../../assets/Fonts';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import InputField from '../../components/InputFild';
import {Svg} from '../../helper/SvgProvider';
import CustomButton from '../../components/CustomButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../navigator/AuthStackNavigator';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {checkMobileNumber} from '../../redux/AuthStackReducer/ForgotPasswordSlice';

const MIN_LENGTH = 10;
const MAX_LENGTH = 10;
type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPasswordScreen'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const ForgotPasswordScreen = ({navigation}: Props) => {
  const [contact, setContact] = useState<string>('');
  const [error, setError] = useState<string>('');

  const dispatch = useAppDispatch();
  const {data} = useAppSelector(state => state.mobile);

  const sendOtp = async () => {
    setError('');

    if (!contact) {
      setError('Phone number is required.');
    } else if (contact.length < MIN_LENGTH || contact.length > MAX_LENGTH) {
      setError(
        `Phone number must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits.`,
      );
    } else {
      try {
        const actionResult = await dispatch(
          checkMobileNumber({data: data || '', mobile: contact}), // Provide a default empty string if data is null
        ).unwrap();

        if (actionResult && actionResult.status === 'success') {
          ToastAndroid.showWithGravity(
            'Send OTP Successfully.',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
          const formattedContact = `+91${contact}`;

          navigation.navigate('ForgotPasswordOtpScreen', {
            contact: formattedContact,
            data: actionResult.data.toString(), // Convert to string if needed
          });
        } else {
          // No user found
          setError('Mobile Number Not found. Please register.');
          ToastAndroid.showWithGravity(
            'Mobile Number Not found. Please register.',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        }
      } catch (error: any) {
        // API error handling
        setError(
          error?.message || 'Failed to check mobile number. Please try again.',
        );
        ToastAndroid.showWithGravity(
          'Failed to check mobile number. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
        console.error('checkMobileNumber error:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.loginText}>Forgot Password</Text>
          <InputField
            value={contact}
            onChangeText={text => setContact(text)}
            placeholder="Enter Number"
            keyboardType="number-pad"
            maxLength={MAX_LENGTH}
            leftIcon={
              <Svg.Call
                height={responsiveScreenHeight(3)}
                width={responsiveScreenWidth(5)}
              />
            }
          />
          {error && <Text style={styles.errorText}>{error}</Text>}

          <CustomButton
            title="SEND OTP"
            onPress={sendOtp}
            buttonStyle={{backgroundColor: Colors.Yellow}}
            textStyle={{color: Colors.black}}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

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
  loginText: {
    color: Colors.white,
    fontSize: FontSizes.large1,
    marginBottom: responsiveScreenHeight(2),
    textAlign: 'center',
    fontFamily: Fonts.ExtraBold,
  },

  errorText: {
    color: Colors.Yellow,
    marginVertical: responsiveScreenHeight(-1),
    textAlign: 'right',
  },
});
