// persistUserMiddleware.ts
import {Middleware} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistUserMiddleware: Middleware =
  store => next => async (action: any) => {
    const result = next(action);

    if (action.type === 'user/setUser') {
      try {
        const userData = JSON.stringify(action.payload);
        await AsyncStorage.setItem('user', userData);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    } else if (action.type === 'user/clearUser') {
      try {
        await AsyncStorage.removeItem('user');
      } catch (error) {
        console.error('Error removing user data:', error);
      }
    }

    return result;
  };
