import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './AuthStackReducer/authSlice';
import ragisterReducer from './AuthStackReducer/RegisterSlice';
import ForgotPasswordSlice from './AuthStackReducer/ForgotPasswordSlice';
import  setPasswordSlice  from './AuthStackReducer/NewSetPasswordSlice';
import { persistUserMiddleware } from './MiddlewareAsyncStorage/Middleware';
import  changePassword  from './AuthStackReducer/changePasswordSlice';
import  deletAccountSlice  from './AuthStackReducer/deletAccountSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
       auth: authReducer,
       ragister:ragisterReducer,
       mobile:ForgotPasswordSlice,
       setPassword:setPasswordSlice,
       changePassword:changePassword,
       deletAccount:deletAccountSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistUserMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
