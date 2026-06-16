import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params, thunkAPI) => {
    try {
      const { data } = await API.get('/api/products', { params })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      )
    }
  }
)

export const getProductById = createAsyncThunk(
  'products/getById',
  async (id, thunkAPI) => {
    try {
      const { data } = await API.get(`/api/products/${id}`)
      return data.product
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      )
    }
  }
)

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeatured',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get('/api/products/featured')
      return data.products
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch featured'
      )
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    featuredProducts: [],
    product: null,
    loading: false,
    error: null,
    pages: 1,
    page: 1,
    total: 0,
  },
  reducers: {
    clearProductError: (state) => { state.error = null },
    clearProduct: (state) => { state.product = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload?.products || []
        state.pages = action.payload?.pages || 1
        state.page = action.payload?.page || 1
        state.total = action.payload?.total || 0
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.products = []
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true
        state.error = null
        state.product = null
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload || null
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.product = null
      })
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.featuredProducts = action.payload || []
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.featuredProducts = []
      })
  },
})

export const { clearProductError, clearProduct } = productSlice.actions
export default productSlice.reducer