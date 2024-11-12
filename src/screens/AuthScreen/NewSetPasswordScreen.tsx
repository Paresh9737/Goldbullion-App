import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'NewSetPasswordScreen'
>;

type FormData = {
  password: string;
  newpassword: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const NewSetPasswordScreen = ({navigation}: Props) => {
  const [ShowPassword, setShowPassword] = useState<Boolean>(false);
  const [ShowPasswordSecond, setShowPasswordSecond] = useState<Boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    password: '',
    newpassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});

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

  const Submit = () => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'new password  6 characters';
      isValid = false;
    }
    if (!formData.newpassword || formData.newpassword.length < 6) {
      newErrors.newpassword = 'comfirm password  6 characters';
      isValid = false;
    }

    if (formData.password !== formData.newpassword) {
      newErrors.newpassword = 'Passwords do not match';

      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      navigation.navigate('LoginScreen');
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
