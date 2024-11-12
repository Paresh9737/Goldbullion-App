import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Linking,
  Platform,
  AppState,
  Image,
  AppStateStatus,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {AuthContext, AuthContextType} from './AuthContaxt'; // Note: Fixed import to include type
import DrawerNavigator from '../DrawerNavigater';
import AuthStackNavigator from '../AuthStackNavigator';
import CustomAlert from '../../components/CustomAlert';
import {ERRORS, MESSAGES} from './constants';

// Define state interface for better type safety
interface AuthState {
  alertVisible: boolean;
  alertMessage: string;
  isSecuritySettings: boolean;
  isSecurityVerified: boolean;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const AppNav: React.FC = () => {
  // Use the imported AuthContextType
  const {isLoading, userToken} = useContext<AuthContextType>(AuthContext);
  const [authState, setAuthState] = useState<AuthState>({
    alertVisible: false,
    alertMessage: '',
    isSecuritySettings: false,
    isSecurityVerified: false,
  });

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState(prev => ({...prev, ...updates}));
  };

  const handleSecurityNotAvailable = useCallback(() => {
    updateAuthState({
      alertMessage: MESSAGES.ENABLE_SECURITY,
      alertVisible: true,
      isSecuritySettings: true,
      isSecurityVerified: false,
    });
  }, []);

  const authenticateUser = useCallback(async () => {
    try {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();

      if (!available) {
        handleSecurityNotAvailable();
        return;
      }

      const promptMessage =
        biometryType === BiometryTypes.Biometrics
          ? MESSAGES.USE_FINGERPRINT
          : MESSAGES.USE_DEVICE_CREDENTIALS;

      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      if (success) {
        updateAuthState({
          isSecurityVerified: true,
          alertVisible: false,
        });
      } else {
        updateAuthState({
          alertMessage: MESSAGES.APP_LOCKED,
          isSecuritySettings: false,
          isSecurityVerified: false,
          alertVisible: true,
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);

      const errorMessage =
        error instanceof Error ? error.message.toLowerCase() : '';
      if (
        errorMessage.includes('security') ||
        errorMessage.includes('credentials')
      ) {
        handleSecurityNotAvailable();
      } else {
        updateAuthState({
          alertMessage: MESSAGES.APP_LOCKED,
          isSecuritySettings: false,
          isSecurityVerified: false,
          alertVisible: true,
        });
      }
    }
  }, [handleSecurityNotAvailable]);

  const openSecuritySettings = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.sendIntent('android.settings.SECURITY_SETTINGS');
      } else {
        await Linking.openSettings();
      }
      startSecuritySettingsPolling();
    } catch (error) {
      console.error('Error opening settings:', error);
      await Linking.openSettings();
    }
  }, []);

  const startSecuritySettingsPolling = useCallback(() => {
    const POLL_INTERVAL = 1000;
    const MAX_POLL_TIME = 300000; // 5 minutes

    const pollInterval = setInterval(async () => {
      const {available} = await rnBiometrics.isSensorAvailable();
      if (available) {
        clearInterval(pollInterval);
        authenticateUser();
      }
    }, POLL_INTERVAL);

    setTimeout(() => clearInterval(pollInterval), MAX_POLL_TIME);
  }, [authenticateUser]);

  const checkAndAuthenticateUser = useCallback(async () => {
    const {available} = await rnBiometrics.isSensorAvailable();
    if (!available) {
      handleSecurityNotAvailable();
    } else {
      authenticateUser();
    }
  }, [authenticateUser, handleSecurityNotAvailable]);

  useEffect(() => {
    checkAndAuthenticateUser();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          checkAndAuthenticateUser();
        }
      },
    );

    return () => subscription.remove();
  }, [checkAndAuthenticateUser]);

  if (isLoading || !authState.isSecurityVerified) {
    return (
      <>
        <View style={styles.loadingContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/png/logo.png')}
          />
        </View>

        <CustomAlert
          visible={authState.alertVisible}
          title={MESSAGES.APP_LOCKED_TITLE}
          message={authState.alertMessage}
          buttonText1={
            authState.isSecuritySettings ? 'Go to Settings' : 'Retry'
          }
          onCancel={() => updateAuthState({alertVisible: false})}
          onUnlock={() => {
            updateAuthState({alertVisible: false});
            if (authState.isSecuritySettings) {
              openSecuritySettings();
            } else {
              checkAndAuthenticateUser();
            }
          }}
          exitApp
        />
      </>
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <DrawerNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    height: '50%',
    width: '50%',
    resizeMode: 'contain',
  },
});

export default AppNav;
