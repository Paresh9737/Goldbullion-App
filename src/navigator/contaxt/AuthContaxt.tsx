// AuthContext.tsx
import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/hook';
import {logoutUser, setUser} from '../../redux/userSlice';

export type AuthContextType = {
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  userToken: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: async () => {},
  isLoading: false,
  userToken: null,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const login = async (token: string, userData: any) => {
    try {
      setIsLoading(true);

      // Save token
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);

      // Save user data
      const userDataString = JSON.stringify(userData);
      await AsyncStorage.setItem('user', userDataString);
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Login storage error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear token
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);

      // Clear user data
      await AsyncStorage.removeItem('user');
      dispatch(logoutUser());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadStoredData = async () => {
    try {
      setIsLoading(true);

      // Load token
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);

      // Load user data
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData && typeof userData === 'object') {
            dispatch(setUser(userData));
          } else {
            // Invalid data format, clear it
            await AsyncStorage.removeItem('user');
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // Clear corrupted data
          await AsyncStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      // Clear everything on error
      await AsyncStorage.multiRemove(['userToken', 'user']);
      setUserToken(null);
      dispatch(logoutUser());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
      {children}
    </AuthContext.Provider>
  );
};
