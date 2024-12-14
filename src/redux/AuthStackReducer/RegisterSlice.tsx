import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';
// આ ઈન્ટરફેસમાં યુઝરના રજિસ્ટ્રેશન માટે જરૂરી ડેટાની વ્યાખ્યા છે.
interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  country_code: string;
  mobile: string;
  address: string;
}
// આ ઈન્ટરફેસમાં સ્ટેટ મેનેજ કરવા માટેના તમામ ફીલ્ડ્સ અને તેમની પ્રારંભિક હાલત દર્શાવવામાં આવી છે.
interface RegisterState {
  userData: {
    username: string | null;
    email: string | null;
    country_code: string | null;
    mobile: string | null;
    address: string | null;
  } | null;

  message: string | null;
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}
// પ્રારંભમાં સ્ટેટની વ્યાખ્યા કરવામાં આવી છે.
const initialState: RegisterState = {
  userData: null,
  message: null,
  status: 'idle',
  error: null,
};
// આ એThunk છે જે API પર POST વિનંતી મોકલે છે.
export const registerUser = createAsyncThunk(
  'auth/registerUser', // Thunkનું નામ
  async (payload: RegisterPayload, {rejectWithValue}) => {
    // Async function
    try {
      // API કૉલ
      const response = await APIClient.post('register', payload);

      if (response.data.status === 'fail') {
        return rejectWithValue(response.data); // ભૂલ હેન્ડલ કરે છે
      }
      // સફળ રિસ્પૉન્સ
      return response.data;
    } catch (error: any) {
      // API કૉલ નિષ્ફળ રહે ત્યારે:
      return rejectWithValue(
        error.response?.data || {
          message: 'Registration failed',
          status: 'fail',
        },
      );
    }
  },
);

// createSlice વડે એક Redux slice બનાવવામાં આવ્યું છે જે reducers અને extraReducersનો ઉપયોગ કરે છે.
const RegisterSlice = createSlice({
  name: 'auth/RegisterSlice',
  initialState,
  // resetRegistration: રજિસ્ટ્રેશનના સ્ટેટને ફરીથી શરૂ કરવા માટે.
  reducers: {
    resetRegistration: state => {
      return {...initialState};
    },
    clearUserData: state => {
      state.userData = null;
      state.message = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
        state.userData = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.userData = {
          username: action.payload.username,
          email: action.payload.email,
          country_code: action.payload.country_code,
          mobile: action.payload.mobile,
          address: action.payload.address,
        };
        state.message = action.payload.message;

        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.status = 'fail';
        state.error =
          action.payload?.message ||
          action.error?.message ||
          'Registration failed';
        state.message = state.error;
        state.userData = null;
      });
  },
});
// Reducer અને એક્શનને એક્સપોર્ટ કરવું.
export const {resetRegistration, clearUserData} = RegisterSlice.actions;
export default RegisterSlice.reducer;
