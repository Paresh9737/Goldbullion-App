import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/hook';
import {logoutUser} from '../../redux/userSlice';

export type AuthContextType = {
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  userToken: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  isLoading: false,
  userToken: null,
});
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const login = () => {
    setIsLoading(true);
    setUserToken('newUserAsyn');
    AsyncStorage.setItem('userToken', 'newUserAsyn');
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('user');
    dispatch(logoutUser());

    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLogged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
      {children}
    </AuthContext.Provider>
  );
};
