  import { createSlice, PayloadAction } from '@reduxjs/toolkit';

  interface UserState {
    id: string;
    username: string;
    email: string;
    mobile: string;
    address: string;
    password: string;
  }
  
  const initialState: UserState = {
    id: '',
    username: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
  };
  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<UserState>) => {
        return { ...action.payload };
      },
      logoutUser: () => initialState,
    },
  });

  export const { setUser, logoutUser } = userSlice.actions;
  export default userSlice.reducer;
