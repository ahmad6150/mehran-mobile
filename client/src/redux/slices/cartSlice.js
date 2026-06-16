import { createSlice } from '@reduxjs/toolkit'

// Safe localStorage read
const getCartFromStorage = () => {
  try {
    const data = localStorage.getItem('mehranCart')
    return data ? JSON.parse(data) : []
  } catch {
    localStorage.removeItem('mehranCart')
    return []
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromStorage(),
    shippingAddress: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existItem = state.items.find((i) => i.product === item.product)
      if (existItem) {
        state.items = state.items.map((i) =>
          i.product === existItem.product ? item : i
        )
      } else {
        state.items = [...state.items, item]
      }
      try {
        localStorage.setItem('mehranCart', JSON.stringify(state.items))
      } catch (error) {
        console.warn('Unable to save cart to storage', error)
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload)
      try {
        localStorage.setItem('mehranCart', JSON.stringify(state.items))
      } catch (error) {
        console.warn('Unable to save cart to storage', error)
      }
    },
    updateQuantity: (state, action) => {
      const { productId, qty } = action.payload
      state.items = state.items.map((i) =>
        i.product === productId ? { ...i, qty } : i
      )
      try {
        localStorage.setItem('mehranCart', JSON.stringify(state.items))
      } catch (error) {
        console.warn('Unable to save cart to storage', error)
      }
    },
    clearCart: (state) => {
      state.items = []
      try {
        localStorage.removeItem('mehranCart')
      } catch (error) {
        console.warn('Unable to clear cart storage', error)
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  saveShippingAddress,
} = cartSlice.actions

export default cartSlice.reducer