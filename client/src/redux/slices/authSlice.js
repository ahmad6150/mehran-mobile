import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

const user = JSON.parse(localStorage.getItem('mehranUser'))
const token = localStorage.getItem('mehranToken')

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post('/api/auth/register', userData)
      localStorage.setItem('mehranToken', data.token)
      localStorage.setItem('mehranUser', JSON.stringify(data.user))
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post('/api/auth/login', userData)
      localStorage.setItem('mehranToken', data.token)
      localStorage.setItem('mehranUser', JSON.stringify(data.user))
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('mehranToken')
  localStorage.removeItem('mehranUser')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    clearSuccess: (state) => { state.success = false },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.success = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.success = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const { clearError, clearSuccess } = authSlice.actions
export default authSlice.reducer