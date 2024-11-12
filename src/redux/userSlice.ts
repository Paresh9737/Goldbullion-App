import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string | null;
  password: string | null;
  contact: string | null;
  email:  string | null;
  fiemName:  string | null;
  gst:  string | null;
  city: string | null;
}

const initialState: UserState = {
  username: null,
  password: null,
  contact: null,
  email: null,
  fiemName: null,
  gst: null,
  city: null,

};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.contact = action.payload.contact;
      state.email = action.payload.email;
      state.fiemName = action.payload.fiemName;
      state.gst = action.payload.gst;
      state.city = action.payload.city;



    },
    logoutUser: (state) => {
      state.username = null;
      state.password = null;
      state.contact = null;
      email: null;
      fiemName: null;
      gst: null;
      city: null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
