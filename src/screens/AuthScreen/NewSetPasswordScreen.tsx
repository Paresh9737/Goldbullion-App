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
import {setPasswordSlice} from '../../redux/AuthStackReducer/NewSetPasswordSlice';

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'NewSetPasswordScreen'
>;
type Props = {
  navigation: RegisterScreenNavigationProp;
  route: {
    params: {
      data: string;
    };
  };
};
type FormData = {
  password: string;
  newpassword: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};

const NewSetPasswordScreen = ({navigation, route}: Props) => {
  const [ShowPassword, setShowPassword] = useState<Boolean>(false);
  const [ShowPasswordSecond, setShowPasswordSecond] = useState<Boolean>(false);
  const {data} = route.params;
  const [formData, setFormData] = useState<FormData>({
    password: '',
    newpassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useAppDispatch();
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

  const Submit = async () => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'New password must be at least 6 characters';
      isValid = false;
    }
    if (!formData.newpassword || formData.newpassword.length < 6) {
      newErrors.newpassword = 'Confirm password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.newpassword) {
      newErrors.newpassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      try {
        const actionResult = await dispatch(
          setPasswordSlice({
            id: data, // Use 'data' as the 'id'
            password: formData.password,
            password_confirmation: formData.newpassword,
            data1: data,
          }),
        ).unwrap();

        if (actionResult && actionResult.status === 'success') {
          ToastAndroid.showWithGravity(
            'Set new password Successfully.',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );

          navigation.navigate('LoginScreen');
        } else {
          ToastAndroid.showWithGravity(
            'Something went wrong.',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        }
      } catch (error: any) {
        ToastAndroid.showWithGravity(
          error?.message || 'Failed to set password. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      }
    }
    return isValid;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.secondContainer}>
          <Text style={styles.loginText}>Set New Password</Text>

          <InputField
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="new password"
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
            onPress={Submit}
            buttonStyle={{backgroundColor: Colors.Yellow}}
            textStyle={{color: Colors.black}}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewSetPasswordScreen;

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
