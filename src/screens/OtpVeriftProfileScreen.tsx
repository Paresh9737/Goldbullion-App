import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {DrawerParamList} from '../navigator/DrawerNavigater';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppDispatch, useAppSelector} from '../redux/hook';
import InputField from '../components/InputFild';
import {Svg} from '../helper/SvgProvider';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomButton from '../components/CustomButton';
import {Colors} from '../theme/Colors';
import {FontSizes} from '../theme/FontSizes';
import {Fonts} from '../assets/Fonts';
import {setUser} from '../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from '../redux/store';
import {changePasswordUser} from '../redux/AuthStackReducer/changePasswordSlice';
import {AuthContext} from '../navigator/contaxt/AuthContaxt';
import {showMessage} from 'react-native-flash-message';
import CustomFlashMessage from '../components/CustomFlashMessage';

type OtpVeriftProfileScreenProps = {
  navigation: StackNavigationProp<DrawerParamList, 'OtpVeriftProfileScreen'>;
};

type FormData = {
  password: string;
  newpassword: string;
  oldpassword: string;
};

type Errors = {
  [K in keyof FormData]?: string;
};

const OtpVeriftProfileScreen: React.FC<OtpVeriftProfileScreenProps> = ({
  navigation,
}) => {
  const [ShowPassword, setShowPassword] = useState<Boolean>(false);
  const [ShowPasswordSecond, setShowPasswordSecond] = useState<Boolean>(false);
  const user = useAppSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<FormData>({
    password: '',
    newpassword: '',
    oldpassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const {logout} = useContext(AuthContext);
  const dispatch = useAppDispatch();

  const changePasswordStatus = useAppSelector(
    state => state.changePassword.status,
  );
  const changePasswordError = useAppSelector(
    state => state.changePassword.error,
  );

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        dispatch(setUser(JSON.parse(userData)));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!ShowPassword);
  };

  const toggleShowPasswordSecond = () => {
    setShowPasswordSecond(!ShowPasswordSecond);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Comprehensive password validation
    if (!formData.oldpassword) {
      newErrors.oldpassword = 'Old password is required';
    } else if (formData.oldpassword.length < 6) {
      newErrors.oldpassword = 'Old password must be at least 6 characters';
    }

    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'New password must be at least 6 characters';
    }

    if (!formData.newpassword) {
      newErrors.newpassword = 'Confirm password is required';
    } else if (formData.newpassword.length < 6) {
      newErrors.newpassword = 'Confirm password must be at least 6 characters';
    }

    if (formData.password !== formData.newpassword) {
      newErrors.newpassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const actionResult = await dispatch(
        changePasswordUser({
          user_id: user.id,
          password: formData.password,
          password_confirmation: formData.newpassword,
          old_password: formData.oldpassword,
        }),
      ).unwrap();

      // Handle successful password change
      if (actionResult.status === 'success') {
        showMessage({
          message: 'Success',
          description: 'Password changed successfully',
          type: 'success',
          duration: 3000,
        });

        // Optional: Navigate away or logout
        logout();
      } else {
        // Handle server-side validation or error
        showMessage({
          message: 'Error',
          description: actionResult.message || 'Password change failed',
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (error: any) {
      // Handle unexpected errors
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        'An unexpected error occurred';

      // Multiple error reporting mechanisms
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);

      showMessage({
        message: 'Change Password Error',
        description: errorMessage,
        type: 'danger',
        duration: 3000,
      });
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <CustomFlashMessage position="top" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.loginText}>Set New Password</Text>

          <InputField
            value={formData.oldpassword}
            onChangeText={text => handleInputChange('oldpassword', text)}
            placeholder="old password"
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

          {errors.oldpassword ? (
            <Text style={styles.errorText}>{errors.oldpassword}</Text>
          ) : null}

          {/* *********************  */}

          <InputField
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="new password"
            secureTextEntry={!ShowPasswordSecond}
            leftIcon={
              <Svg.LockPassword
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
            rightIcon={
              <TouchableOpacity onPress={toggleShowPasswordSecond}>
                {ShowPasswordSecond ? (
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

          <InputField
            value={formData.newpassword}
            onChangeText={text => handleInputChange('newpassword', text)}
            placeholder="comfirm password"
            secureTextEntry={!ShowPasswordSecond}
            leftIcon={
              <Svg.LockPassword
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
            rightIcon={
              <TouchableOpacity onPress={toggleShowPasswordSecond}>
                {ShowPasswordSecond ? (
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
          {errors.newpassword ? (
            <Text style={styles.errorText}>{errors.newpassword}</Text>
          ) : null}

          <CustomButton
            title="SUBMIT"
            onPress={handleSubmit}
            buttonStyle={{backgroundColor: Colors.Yellow}}
            textStyle={{color: Colors.black}}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OtpVeriftProfileScreen;

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
