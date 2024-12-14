import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {showMessage} from 'react-native-flash-message';
// Components
import CustomButton from '../../components/CustomButton';
import CustomFlashMessage from '../../components/CustomFlashMessage';
import InputField from '../../components/InputFild';
import {Svg} from '../../helper/SvgProvider';
// Hooks and Utils
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {
  clearUserData,
  registerUser,
  resetRegistration,
} from '../../redux/AuthStackReducer/RegisterSlice';
// Types and Constants
import {Fonts} from '../../assets/Fonts';
import {FontSizes} from '../../theme/FontSizes';
import {Colors} from '../../theme/Colors';
import {AuthStackParamList} from '../../navigator/AuthStackNavigator';
import {useFocusEffect} from '@react-navigation/native';
import {
  isValidAddress,
  isValidPassword,
  VALIDATION,
} from '../../utils/Validator';
import {
  isValidEmail,
  isValidMobile,
  isValidUsername,
} from '../../utils/Validator';
interface RegisterScreenNavigationProp {
  navigation: StackNavigationProp<AuthStackParamList, 'OtpScreen'>;
}
type RegisterFormData = {
  username: string;
  password: string;
  email: string;
  mobile: string;
  country_code: string;
  address: string;
};
const REGISTER_INITIAL_FORM_STATE: RegisterFormData = {
  username: '',
  password: '',
  email: '',
  mobile: '',
  country_code: '+91',
  address: '',
};

type Errors = {
  [K in keyof RegisterFormData]?: string;
};

const RegisterScreen = ({navigation}: RegisterScreenNavigationProp) => {
  const [ShowPassword, setShowPassword] = useState<Boolean>(false);
  const [formData, setFormData] = useState<RegisterFormData>(
    REGISTER_INITIAL_FORM_STATE,
  );
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    state => state.ragister.status === 'loading',
  );
  // Reset input fields and errors when screen is focused
  useFocusEffect(
    useCallback(() => {
      setFormData(REGISTER_INITIAL_FORM_STATE);
      setErrors({});
    }, []),
  );
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleRegister = async () => {
    let newErrors: Errors = {};
    let isValid = true;
    const usernameValidation = isValidUsername(formData.username);
    if (usernameValidation !== '') {
      newErrors.username = usernameValidation;
      isValid = false;
    }

    // Password validation
    const passwordValidation = isValidPassword(formData.password);
    if (passwordValidation !== '') {
      newErrors.password = passwordValidation;
      isValid = false;
    }

    // Mobile validation
    const mobileValidation = isValidMobile(formData.mobile);
    if (mobileValidation !== '') {
      newErrors.mobile = mobileValidation;
      isValid = false;
    }

    // Email validation
    const emailValidation = isValidEmail(formData.email);
    if (emailValidation !== '') {
      newErrors.email = emailValidation;
      isValid = false;
    }

    // Address validation
    const addressValidation = isValidAddress(formData.address);
    if (addressValidation !== '') {
      newErrors.address = addressValidation;
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        await dispatch(registerUser(formData)).unwrap();

        navigation.navigate('OtpScreen', {
          navigationData: formData,
        });

        ToastAndroid.showWithGravity(
          'Registration success',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        // Reset form and state
        setFormData(REGISTER_INITIAL_FORM_STATE);

        dispatch(clearUserData());
      } catch (error: any) {
        // More detailed error handling
        const errorMessage =
          error.message ||
          error.response?.data?.message ||
          'An unexpected error occurred during registration';
        ToastAndroid.showWithGravity(
          errorMessage,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        showMessage({
          message: 'Registration Error',
          description: errorMessage,
          type: 'danger',
          duration: 3000,
        });
      }
    }
    return isValid;
  };

  const renderInputField = (
    field: keyof RegisterFormData,
    placeholder: string,
    icon: React.ReactNode,
    props = {},
  ) => (
    <>
      <InputField
        value={formData[field]}
        onChangeText={text => handleInputChange(field, text)}
        placeholder={placeholder}
        leftIcon={icon}
        {...props}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </>
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <CustomFlashMessage position="top" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.RegisterText}>Signup</Text>

          {renderInputField(
            'username',
            'Username',
            <Svg.Use
              height={responsiveScreenHeight(5)}
              width={responsiveScreenWidth(7)}
            />,
          )}

          {renderInputField(
            'password',
            'Password',
            <Svg.LockPassword
              height={responsiveScreenHeight(5)}
              width={responsiveScreenWidth(7)}
            />,
            {
              secureTextEntry: !ShowPassword,
              rightIcon: (
                <TouchableOpacity
                  onPress={() => setShowPassword(!ShowPassword)}>
                  {ShowPassword ? (
                    <Svg.Eye
                      height={responsiveScreenHeight(5)}
                      width={responsiveScreenWidth(7)}
                    />
                  ) : (
                    <Svg.CloseEye
                      height={responsiveScreenHeight(5)}
                      width={responsiveScreenWidth(7)}
                    />
                  )}
                </TouchableOpacity>
              ),
            },
          )}

          {renderInputField(
            'mobile',
            'Mobile No.',
            <Svg.Call
              height={responsiveScreenHeight(4)}
              width={responsiveScreenWidth(5)}
            />,
            {
              maxLength: 10,
              keyboardType: 'number-pad',
            },
          )}

          {renderInputField(
            'email',
            'Email',
            <Svg.Email
              height={responsiveScreenHeight(5)}
              width={responsiveScreenWidth(6)}
            />,
            {
              keyboardType: 'email-address',
            },
          )}

          {renderInputField(
            'address',
            'Address',
            <Svg.Use
              height={responsiveScreenHeight(5)}
              width={responsiveScreenWidth(7)}
            />,
          )}

          <CustomButton
            title={isLoading ? 'Loading...' : 'VERIFY'}
            onPress={handleRegister}
            buttonStyle={{
              backgroundColor: Colors.Yellow,
              opacity: isLoading ? 0.5 : 1,
            }}
            textStyle={{color: Colors.black}}
            disabled={isLoading}
          />
          <View style={styles.accountContainer}>
            <Text style={styles.addAccountText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={[styles.addAccountText, styles.LoginText]}>
                Login Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
  RegisterText: {
    color: Colors.white,
    fontSize: FontSizes.large1,
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(2),
    textAlign: 'center',
    fontFamily: Fonts.ExtraBold,
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(2),
  },
  addAccountText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: FontSizes.small,
    fontFamily: Fonts.SemiBold,
  },
  LoginText: {
    color: Colors.Yellow,
    fontFamily: Fonts.ExtraBold,
    fontSize: FontSizes.medium,
  },
  errorText: {
    color: Colors.Yellow,
    marginVertical: responsiveScreenHeight(-1),
    textAlign: 'right',
  },
});
