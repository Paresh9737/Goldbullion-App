import {Middleware} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistUserMiddleware: Middleware =
  store => next => async (action: any) => {
    if (action.type === 'user/setUser') {
      await AsyncStorage.setItem('user', JSON.stringify(action.payload));
    } else if (action.type === 'user/logoutUser') {
      await AsyncStorage.removeItem('user');
    }
    return next(action);
  };
