import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';

// Consistent naming
interface DeleteAccountPayload {
  id: string | null;
}

interface DeleteAccountState {
  id: string | null;
  message: string | null;
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: DeleteAccountState = {
  id: null,
  message: null,
  status: 'idle',
  error: null,
};

// Correct endpoint name
export const deleteAccountUser = createAsyncThunk(
  'auth/deleteAccount',
  async (payload: DeleteAccountPayload, {rejectWithValue}) => {
    try {
      // Use correct endpoint for account deletion
      const response = await APIClient.post('deletAccount', payload);
      console.log('deleteAccount', response.message);
      if (response.data.status === 'fail') {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Account deletion failed',
          status: 'fail',
        },
      );
    }
  },
);

const deleteAccountSlice = createSlice({
  name: 'auth/DeleteAccountSlice',
  initialState,
  reducers: {
    // Consistent naming
    resetDeleteAccount: state => {
      return {...initialState};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(deleteAccountUser.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(deleteAccountUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.id = action.payload.id;
        state.message = action.payload.message;
      })
      .addCase(deleteAccountUser.rejected, (state, action: any) => {
        state.status = 'fail';
        state.error = action.payload?.message || 'Account deletion failed';
        state.message = action.payload?.message || 'Account deletion failed';
      });
  },
});

// Consistent naming
export const {resetDeleteAccount} = deleteAccountSlice.actions;
export default deleteAccountSlice.reducer;
