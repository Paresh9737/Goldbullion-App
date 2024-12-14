import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';

// આ ઈન્ટરફેસમાં યુઝરના રજિસ્ટ્રેશન માટે જરૂરી ડેટાની વ્યાખ્યા છે.
interface changePasswordPayload {
  user_id: string | null;
  password: string;
  password_confirmation: string;
  old_password: string;
}
// આ ઈન્ટરફેસમાં સ્ટેટ મેનેજ કરવા માટેના તમામ ફીલ્ડ્સ અને તેમની પ્રારંભિક હાલત દર્શાવવામાં આવી છે.
interface changePasswordState {
  user_id: string | null;
  password: string | null;
  password_confirmation: string | null;
  old_password: string | null;
  message: string | null;
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}
// પ્રારંભમાં સ્ટેટની વ્યાખ્યા કરવામાં આવી છે.
const initialState: changePasswordState = {
  user_id: null,
  password: null,
  password_confirmation: null,
  old_password: null,
  message: null,
  status: 'idle',
  error: null,
};

export const changePasswordUser = createAsyncThunk(
  'auth/changePassword', // Thunkનું નામ
  async (payload: changePasswordPayload, {rejectWithValue}) => {
    // Async function
    try {
      // API કૉલ
      const response = await APIClient.post('changePassword', payload);
      console.log('changePassword', response.data);
      if (response.data.status === 'fail') {
        return rejectWithValue(response.data); // ભૂલ હેન્ડલ કરે છે
      }
      // સફળ રિસ્પૉન્સ
      return response.data;
    } catch (error: any) {
      // API કૉલ નિષ્ફળ રહે ત્યારે:
      return rejectWithValue(
        error.response?.data || {
          message: 'changePassword failed',
          status: 'fail',
        },
      );
    }
  },
);

// createSlice વડે એક Redux slice બનાવવામાં આવ્યું છે જે reducers અને extraReducersનો ઉપયોગ કરે છે.
const changePasswordSlice = createSlice({
  name: 'auth/RegisterSlice',
  initialState,
  // resetRegistration: રજિસ્ટ્રેશનના સ્ટેટને ફરીથી શરૂ કરવા માટે.
  reducers: {
    changePassword: state => {
      return {...initialState};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(changePasswordUser.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })

      .addCase(changePasswordUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.user_id = action.payload.user_id;
        state.password = action.payload.password;
        state.password_confirmation = action.payload.password_confirmation;
        state.old_password = action.payload.old_password;
        state.message = action.payload.message;
      })
      .addCase(changePasswordUser.rejected, (state, action: any) => {
        state.status = 'fail';
        state.error =
          action.payload?.message || action.error?.message || 'changePassword';
        state.message = state.error;
      });
  },
});
// Reducer અને એક્શનને એક્સપોર્ટ કરવું.
export const {changePassword} = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
