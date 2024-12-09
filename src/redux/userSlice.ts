  import { createSlice, PayloadAction } from '@reduxjs/toolkit';

  interface UserState {
    username: string | null;
    password: string | null;
    mobile: string | null;
    email: string | null;
    address: string | null;
    id:string|null;
  }

  const initialState: UserState = {
    username: null,
    password: null,
    mobile: null,
    email: null,
    address: null,
    id:null,
  };

  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<UserState>) => {
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.mobile = action.payload.mobile;
        state.email = action.payload.email;
        state.address = action.payload.address;
        state.id=action.payload.id
      },
      logoutUser: (state) => {
        state.username = null;
        state.password = null;
        state.mobile = null;
        state.email = null;
        state.address = null;
      },
    },
  });

  export const { setUser, logoutUser } = userSlice.actions;
  export default userSlice.reducer;
