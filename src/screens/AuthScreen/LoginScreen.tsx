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
import {Colors} from '../../theme/Colors';
import {FontSizes} from '../../theme/FontSizes';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import InputField from '../../components/InputFild';
import {Svg} from '../../helper/SvgProvider';
import CustomButton from '../../components/CustomButton';
import {
  AuthStackNavigationProp,
  AuthStackParamList,
} from '../../navigator/AuthStackNavigator';
import {Fonts} from '../../assets/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../navigator/contaxt/AuthContaxt';
import {useFocusEffect} from '@react-navigation/native';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterScreen'
>;

type FormData = {
  username: string;
  password: string;
};

type Errors = {
  username?: string;
  password?: string;
};

type Props = {
  navigation: AuthStackNavigationProp;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login} = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  // Reset input fields and errors when screen is focused
  useFocusEffect(
    useCallback(() => {
      setFormData({
        username: '',
        password: '',
      });
      setErrors({});
    }, []),
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    const newErrors: Errors = {};
    let valid = true;

    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    if (valid) {
      login();
      console.log('Login Done');

      // try {
      //   const storedUserData = await AsyncStorage.getItem('user');
      //   if (storedUserData) {
      //     const userData = JSON.parse(storedUserData);
      //     if (
      //       userData.username === formData.username &&
      //       userData.password === formData.password
      //     ) {
      //       setFormData({
      //         username: '',
      //         password: '',
      //       });
      //       login();
      //       console.log('Login Done');
      //       ToastAndroid.show('Login Done', ToastAndroid.SHORT);
      //     } else {
      //       ToastAndroid.show(
      //         'Invalid username or password',
      //         ToastAndroid.SHORT,
      //       );
      //     }
      //   } else {
      //     ToastAndroid.show('No user data found', ToastAndroid.SHORT);
      //   }
      // } catch (error) {
      //   console.error('Error retrieving user data from AsyncStorage:', error);
      // }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.loginText}>Login</Text>
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
