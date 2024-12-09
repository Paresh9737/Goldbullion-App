import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';

interface MobileState {
  data: string | null;
  mobile: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MobileState = {
  data: null,
  mobile: null,
  loading: false,
  error: null,
};

export const checkMobileNumber = createAsyncThunk(
  'auth/checkMobileNumber',
  async ({data, mobile}: {data: string; mobile: string}, {rejectWithValue}) => {
    try {
      const response = await APIClient.post('checkMobileUser', {
        data,
        mobile,
      });
      console.log('checkMobileUser Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('checkMobileUser Error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'checkMobileUser failed',
      );
    }
  },
);

const ForgotPasswordSlice = createSlice({
  name: 'ForgotPasswordSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(checkMobileNumber.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkMobileNumber.fulfilled,
        (state, action: PayloadAction<{mobile: string; data: string}>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.mobile = action.payload.mobile;
        },
      )

      .addCase(
        checkMobileNumber.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export default ForgotPasswordSlice.reducer;
