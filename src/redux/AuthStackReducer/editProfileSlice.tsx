import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';

// Consistent naming
interface editProfilePayload {
  id: string | null;
  email: string | null;
  country_code: string | null;
  mobile: string | null;
  address: string | null;
}

interface editProfileState {
  id: string | null;
  email: string | null;
  country_code: string | null;
  mobile: string | null;
  address: string | null;
  message: string | null;
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: editProfileState = {
  id: null,
  email: null,
  country_code: null,
  mobile: null,
  address: null,
  message: null,
  status: 'idle',
  error: null,
};

// Correct endpoint name
export const editProfileUser = createAsyncThunk(
  'auth/editProfile',
  async (payload: editProfilePayload, {rejectWithValue}) => {
    try {
      // Use correct endpoint for account deletion
      const response = await APIClient.post('editProfile', payload);
      console.log('editProfileUser', response.message);
      if (response.data.status === 'fail') {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || {
          message: 'editProfile  failed',
          status: 'fail',
        },
      );
    }
  },
);

const editProfileSlice = createSlice({
  name: 'auth/editProfileSlice',
  initialState,
  reducers: {
    // Consistent naming
    editProfile: state => {
      return {...initialState};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(editProfileUser.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })

      .addCase(editProfileUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.country_code = action.payload.country_code;
        state.mobile = action.payload.mobile;
        state.address = action.payload.address;
        state.message = action.payload.message;
      })
      .addCase(editProfileUser.rejected, (state, action: any) => {
        state.status = 'fail';
        state.error = action.payload?.message || 'Account deletion failed';
        state.message = action.payload?.message || 'Account deletion failed';
      });
  },
});

// Consistent naming
export const {editProfile} = editProfileSlice.actions;
export default editProfileSlice.reducer;
