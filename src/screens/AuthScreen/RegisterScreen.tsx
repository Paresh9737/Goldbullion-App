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
import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {Colors} from '../../theme/Colors';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import InputField from '../../components/InputFild';
import {Svg} from '../../helper/SvgProvider';
import {FontSizes} from '../../theme/FontSizes';
import CustomButton from '../../components/CustomButton';
import {Fonts} from '../../assets/Fonts';
import {AuthStackParamList} from '../../navigator/AuthStackNavigator';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {
  registerUser,
  resetRegistration,
} from '../../redux/AuthStackReducer/RegisterSlice';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import CustomFlashMessage from '../../components/CustomFlashMessage';
type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterScreen'
>;
type Props = {
  navigation: RegisterScreenNavigationProp;
};
type FormData = {
  username: string;
  password: string;
  email: string;
  contact: string;
  country_code: string;
  address: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 10;

const RegisterScreen = ({navigation}: Props) => {
  const [ShowPassword, setShowPassword] = useState<Boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    contact: '',
    country_code: '+91',
    address: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    state => state.ragister.status === 'loading',
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleRegister = async () => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!formData.username || formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (
      !formData.contact ||
      formData.contact.length < MIN_LENGTH ||
      formData.contact.length > MAX_LENGTH
    ) {
      newErrors.contact = `phone must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits`;
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.address || formData.address.length < 4) {
      newErrors.address = 'Username must be at least 4 characters';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        const result = await dispatch(
          registerUser({
            username: formData.username,
            password: formData.password,
            email: formData.email,
            country_code: formData.country_code,
            mobile: formData.contact,
            address: formData.address,
          }),
        ).unwrap();

        if (result.status === 'success') {
          navigation.navigate('OtpScreen', {
            navigationData: formData,
          });

          ToastAndroid.showWithGravity(
            'Registration success',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );

          // Reset form
          setFormData({
            username: '',
            password: '',
            email: '',
            contact: '',
            country_code: '+91',
            address: '',
          });

          // Reset registration state
          dispatch(resetRegistration());
        } else {
          showMessage({
            message: 'Registration Failed',
            description: result.message || 'Please try again',
            type: 'danger',
            duration: 3000,
          });
        }
      } catch (error: any) {
        showMessage({
          message: 'Error',
          description: error.message || 'An error occurred during registration',
          type: 'danger',
          duration: 3000,
        });
      }
    }

    return isValid;
  };
  const toggleShowPassword = () => {
    setShowPassword(!ShowPassword);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <CustomFlashMessage position="top" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.RegisterText}>Signup</Text>

          {/* username  */}
          <InputField
            value={formData.username}
            onChangeText={text => handleInputChange('username', text)}
            placeholder="Username"
            leftIcon={
              <Svg.Use
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
          />
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : null}
          {/* password  */}
          <InputField
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="Password"
            secureTextEntry={!ShowPassword}
            leftIcon={
              <Svg.LockPassword
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
            rightIcon={
              <TouchableOpacity onPress={toggleShowPassword}>
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
            }
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
          {/* Call  */}
          <InputField
            value={formData.contact}
            onChangeText={text => handleInputChange('contact', text)}
            maxLength={MAX_LENGTH}
            placeholder="Contact No."
            keyboardType="number-pad"
            leftIcon={
              <Svg.Call
                height={responsiveScreenHeight(4)}
                width={responsiveScreenWidth(5)}
              />
            }
          />
          {errors.contact ? (
            <Text style={styles.errorText}>{errors.contact}</Text>
          ) : null}
          {/* Email  */}
          <InputField
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
            placeholder="Email"
            keyboardType="email-address"
            leftIcon={
              <Svg.Email
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(6)}
              />
            }
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
          {/* Filad Name  */}
          <InputField
            value={formData.address}
            onChangeText={text => handleInputChange('address', text)}
            placeholder="address"
            leftIcon={
              <Svg.Use
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
          />
          {errors.address ? (
            <Text style={styles.errorText}>{errors.address}</Text>
          ) : null}

          <CustomButton
            title="VERIFY"
            onPress={handleRegister}
            buttonStyle={{
              backgroundColor: Colors.Yellow,
              opacity: isLoading ? 0.7 : 1,
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
