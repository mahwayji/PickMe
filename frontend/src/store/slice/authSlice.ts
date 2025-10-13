import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { axiosInstance } from '@/lib/axios'
import axios from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface UserState {
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
} 

interface AuthState {
  user: UserState | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

export const login = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/signin', { email, password })
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login failed')
      }
      return rejectWithValue('An unexpected error occurred')
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  return await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})

export const me = createAsyncThunk('auth/me', async (token: string, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    return data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    throw error
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    googleLoginSuccess: (state, action: PayloadAction<{ user: UserState }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(me.pending, (state) => {
        state.isLoading = true
      })
      .addCase(me.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(me.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isLoading = false
      })
      
  },
})
export const { googleLoginSuccess } = authSlice.actions; 
export default authSlice.reducer