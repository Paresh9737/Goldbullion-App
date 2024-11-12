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
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthStackParamList} from '../../navigator/AuthStackNavigator';

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
  contact: any;
  fiemName: string;
  gst: string;
  city: string;
};
type Errors = {
  [K in keyof FormData]?: string;
};
// Phone number ની લંબાઈ નક્કી કરવા માટે કૉન્સ્ટન્ટ્સ
const MIN_LENGTH = 10;
const MAX_LENGTH = 10;

const RegisterScreen = ({navigation}: Props) => {
  const [ShowPassword, setShowPassword] = useState<Boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    contact: '',
    fiemName: '',
    gst: '',
    city: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useDispatch();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleRegister = (): boolean => {
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

    // if (
    //   !formData.contact ||
    //   formData.contact.length < MIN_LENGTH ||
    //   formData.contact.length > MAX_LENGTH
    // ) {
    //   newErrors.contact = `Contact must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits`;
    //   isValid = false;
    // }

    if (!formData.contact) {
      newErrors.contact = 'phone is required';
      isValid = false;
    } else if (
      formData.contact.length < MIN_LENGTH ||
      formData.contact.length > MAX_LENGTH
    ) {
      newErrors.contact = `phone must be between ${MIN_LENGTH} digits`;
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email address';
    //   isValid = false;
    // }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City name must be at least 2 characters';
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      // Prepend +91 to the contact number
      const formattedContact = `+91${formData.contact}`;

      const userData = {
        username: formData.username,
        password: formData.password,
        contact: formData.contact,
        email: formData.email,
        fiemName: formData.fiemName,
        gst: formData.gst,
        city: formData.city,
      };
      dispatch(setUser(userData));
      console.log('userData', userData);
      AsyncStorage.setItem('user', JSON.stringify(userData));
      setFormData({
        username: '',
        password: '',
        email: '',
        contact: '',
        fiemName: '',
        gst: '',
        city: '',
      });

      navigation.navigate('OtpScreen', {
        contact: formattedContact,
      });
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
            value={formData.fiemName}
            onChangeText={text => handleInputChange('fiemName', text)}
            placeholder="Firm Name"
            leftIcon={
              <Svg.Use
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(7)}
              />
            }
          />
          {errors.fiemName ? (
            <Text style={styles.errorText}>{errors.fiemName}</Text>
          ) : null}
          {/* Gst  */}
          <InputField
            value={formData.gst}
            onChangeText={text => handleInputChange('gst', text)}
            placeholder="GST IN"
            leftIcon={
              <Svg.GST
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(6)}
              />
            }
          />
          {errors.gst ? (
            <Text style={styles.errorText}>{errors.gst}</Text>
          ) : null}
          {/* City  */}
          <InputField
            value={formData.city}
            onChangeText={text => handleInputChange('city', text)}
            placeholder="City"
            leftIcon={
              <Svg.City
                height={responsiveScreenHeight(5)}
                width={responsiveScreenWidth(6)}
              />
            }
          />
          {errors.city ? (
            <Text style={styles.errorText}>{errors.city}</Text>
          ) : null}
          <CustomButton
            title="VERIFY"
            onPress={handleRegister}
            buttonStyle={{backgroundColor: Colors.Yellow}}
            textStyle={{color: Colors.black}}
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
