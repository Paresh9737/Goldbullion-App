import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

  const sendOtp = () => {
    if (!contact) {
      setError('phone is required');
    } else if (contact.length < MIN_LENGTH || contact.length > MAX_LENGTH) {
      setError(`phone must be between ${MIN_LENGTH} digits`);
    } else {
      const formattedContact = `+91${contact}`;

      navigation.navigate('ForgotPasswordOtpScreen', {
        contact: formattedContact,
      });
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
