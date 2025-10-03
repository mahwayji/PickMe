import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '@/lib/axios'
import axios from 'axios'

export interface UserState {
  username: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
  isSuperAdmin: boolean
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
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', { username, password })
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
  reducers: {},
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

export default authSlice.reducer