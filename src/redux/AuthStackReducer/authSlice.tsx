import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {APIClient} from '../../api/ApiClient';

// Interface for login payload
export interface LoginPayload {
  username: string;
  password: string;
  email?: string;
  country_code?: string;
  mobile?: string;
  address?: string;
  id?: string;
}

// Interface for authentication state
export interface AuthState {
  user: {
    username: string | null;
    email: string | null;
    mobile: string | null;
    address: string | null;
    password: string | null;
  } | null;
  id: string | null;
  status: 'idle' | 'loading' | 'success' | 'fail';
  message: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  id: null,
  status: 'idle',
  message: null,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, {rejectWithValue}) => {
    try {
      const response = await APIClient.post('login', payload);
      console.log(' login response', response);
      if (response.data.status === 'fail') {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Login failed',
          status: 'fail',
        },
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reset auth slice to initial state
    resetAuthState: state => {
      return {...initialState};
    },

    // Optional: Logout action
    logout: state => {
      state.user = null;
      state.id = null;
      state.status = 'idle';
      state.message = null;
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = {
          username: action.payload.username,
          email: action.payload.email,
          mobile: action.payload.mobile,
          address: action.payload.address,
          password: action.payload.password,
        };
        state.id = action.payload.id;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.status = 'fail';
        state.error = action.payload?.message || 'Login failed';
        state.message = action.payload?.message || 'Login failed';
      });
  },
});

export const {resetAuthState, logout} = authSlice.actions;
export default authSlice.reducer;

// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import {APIClient} from '../../api/ApiClient';

// interface LoginPayload {
//   username: string;
//   password: string;
//   email?: string;
//   country_code?: string;
//   mobile?: string;
//   address?: string;
//   id?: string;
// }

// interface AuthState {
//   user: {
//     username: string | null;
//     password: string | null;
//     email?: string | null;
//     country_code?: null;
//     mobile?: string | null;
//     address?: string | null;
//     id?: string | null;
//   } | null;
//   status: 'idle' | 'loading' | 'success' | 'fail';
//   message: string | null;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   status: 'idle',
//   message: null,
//   error: null,
// };

// export const loginUser = createAsyncThunk(
//   'auth',
//   async (paylode: LoginPayload, {rejectWithValue}) => {
//     try {
//       const response = await APIClient.post('login', {paylode});

//       if (response.data.status === 'fail') {
//         return rejectWithValue(response.data);
//       }

//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data || {
//           message: 'login fail',
//           states: 'fail',
//         },
//       );
//     }
//   },
// );

// const userSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     resetloginData: state => {
//       return {...initialState};
//     },
//   },
//   extraReducers: bulder => {
//     bulder
//       .addCase(loginUser.pending, state => {
//         state.status = 'loading';
//         state.error = null;
//         state.message = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = 'success';
//         state.user = action.payload.user;
//         state.message = action.payload.message;
//       })
//       .addCase(loginUser.rejected, (state, action: any) => {
//         state.status = 'fail';
//         state.error =
//           action.payload.message || action.error.message || 'fail to login';
//         state.message = state.error;
//       });
//   },
// });
// export const {resetloginData} = userSlice.actions;
// export default userSlice.reducer;
