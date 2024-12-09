import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';

interface SetPasswordPayload {
  id: string | null; // Add this line
  data1: string | null;
  password: string;
  email?: string;
  password_confirmation?: string;
}

interface SetPassword {
  data1: string | null;
  password: string | null;
  password_confirmation: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SetPassword = {
  data1: null,
  password: null,
  password_confirmation: null,
  loading: false,
  error: null,
};

export const setPasswordSlice = createAsyncThunk(
  'auth/setPasswordSlice',
  async (payload: SetPasswordPayload, {rejectWithValue}) => {
    try {
      const response = await APIClient.post('setPassword', payload);
      console.log('setPasswordSlice Response:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'setPasswordSlice failed',
      );
    }
  },
);

const setPassword = createSlice({
  name: 'auth/setPassword',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setPasswordSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setPasswordSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.data1 = action.payload.data;
        state.password = action.payload.password;
        state.password_confirmation = action.payload.password_confirmation;
      })
      .addCase(setPasswordSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default setPassword.reducer;
