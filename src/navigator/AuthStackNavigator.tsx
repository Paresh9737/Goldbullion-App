import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
import OtpScreen from '../screens/AuthScreen/OtpScreen';
import NetInfo from '@react-native-community/netinfo';
import CheckInternet from '../screens/CheckInternet';
import ForgotPasswordScreen from '../screens/AuthScreen/ForgotPasswordScreen';
import ForgotPasswordOtpScreen from '../screens/AuthScreen/ForgotPasswordOtpScreen';
import NewSetPasswordScreen from '../screens/AuthScreen/NewSetPasswordScreen';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  OtpScreen: {
    contact: string;
  };
  ForgotPasswordScreen: undefined;
  ForgotPasswordOtpScreen: {
    contact: string;
  };
  NewSetPasswordScreen: undefined;
};

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    // Check initial connection state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      {isConnected ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="ForgotPasswordOtpScreen"
            component={ForgotPasswordOtpScreen}
          />

          <Stack.Screen
            name="NewSetPasswordScreen"
            component={NewSetPasswordScreen}
          />
        </Stack.Navigator>
      ) : (
        <CheckInternet setIsConnected={setIsConnected} />
      )}
    </>
  );
};

export default AuthStackNavigator;
