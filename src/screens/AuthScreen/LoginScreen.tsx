import React, {useState, useContext, useCallback} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';

import {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
// Components
import InputField from '../../components/InputFild';
import CustomButton from '../../components/CustomButton';
import CustomFlashMessage from '../../components/CustomFlashMessage';
import {Svg} from '../../helper/SvgProvider';
// Hooks and Utils
import {AuthContext} from '../../navigator/contaxt/AuthContaxt';
import {useAppDispatch} from '../../redux/hook';
import {loginUser} from '../../redux/AuthStackReducer/authSlice';
import {setUser} from '../../redux/userSlice';
// Types and Constants
import {AuthStackParamList} from '../../navigator/AuthStackNavigator';
import {Colors} from '../../theme/Colors';
import {FontSizes} from '../../theme/FontSizes';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {Fonts} from '../../assets/Fonts';
import {isValidPassword, isValidUsername} from '../../utils/Validator';
interface LoginScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterScreen'>;
}
interface LoginFormData {
  username: string;
  password: string;
  email?: string;
  contact?: string;
  country_code?: string;
  address?: string;
  id?: string;
}

const INITIAL_FORM_STATE: LoginFormData = {
  username: '',
  password: '',
  email: '',
  contact: '',
  country_code: '+91',
  address: '',
  id: '',
};

type Errors = {
  username?: string;
  password?: string;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {login} = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useAppDispatch();

  // Reset input fields and errors when screen is focused
  useFocusEffect(
    useCallback(() => {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    }, []),
  );

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prevData => ({...prevData, [field]: value}));
    if (errors[field as keyof Errors]) {
      setErrors(prevErrors => ({...prevErrors, [field as keyof Errors]: ''}));
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    const newErrors: Errors = {};
    let valid = true;

    const usernameValidation = isValidUsername(formData.username);
    if (usernameValidation !== '') {
      newErrors.username = usernameValidation;
      valid = false;
    }

    // Password validation
    const passwordValidation = isValidPassword(formData.password);
    if (passwordValidation !== '') {
      newErrors.password = passwordValidation;
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const result = await dispatch(loginUser(formData)).unwrap();

        if (result.status === 'success') {
          const userData = {
            username: result.data.username,
            password: result.data.password,
            email: result.data.email,
            mobile: result.data.mobile,
            address: result.data.address,
            id: result.data.id,
          };

          dispatch(setUser(userData));

          const token = result.data.token || String(result.data.id);
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('user', 'userToken');

          // Update login call to pass both token and user data
          await login(token, userData);

          ToastAndroid.showWithGravity(
            'Login Done',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );

          setFormData(INITIAL_FORM_STATE);
        } else {
          showMessage({
            message: 'Error',
            description: result.message || 'Please try again',
            type: 'danger',
            duration: 3000,
          });
        }
      } catch (error: any) {
        showMessage({
          message: 'Error',
          description: error.message || 'No user data found. Please register.',
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <CustomFlashMessage position="top" />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.loginText}>Login</Text>
          {/* username Input Fild  */}
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
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
          {/* password Input Fild  */}
          <InputField
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="Password"
            secureTextEntry={!showPassword}
            leftIcon={
              <Svg.LockPassword
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
            rightIcon={
              <TouchableOpacity onPress={toggleShowPassword}>
                {showPassword ? (
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
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          {/* login button  */}
          <CustomButton
            title="LOGIN"
            onPress={handleLogin}
            buttonStyle={{backgroundColor: Colors.Yellow}}
            textStyle={{color: Colors.black}}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.ForgetPasswordButton}>
            <Text style={styles.ForgetPasswordButtonText}>
              Forgot Password ?
            </Text>
          </TouchableOpacity>
          {/* RegisterScreen naviagtin flow  */}
          <View style={styles.accountContainer}>
            <Text style={styles.addAccountText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={[styles.addAccountText, styles.registerText]}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
  registerText: {
    color: Colors.Yellow,
    fontFamily: Fonts.ExtraBold,
    fontSize: FontSizes.medium,
  },
  errorText: {
    color: Colors.Yellow,
    marginVertical: responsiveScreenHeight(-1),
    textAlign: 'right',
  },
  ForgetPasswordButton: {
    marginVertical: responsiveScreenHeight(-0.5),
  },
  ForgetPasswordButtonText: {
    color: Colors.Yellow,
    fontSize: FontSizes.medium,
    fontFamily: Fonts.Medium,
  },
});
