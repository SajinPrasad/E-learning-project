import { createSlice } from "@reduxjs/toolkit";

const cartItemSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    hasFetched: false, // Flag to indicate if cart items have been fetched
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.hasFetched = true; // Mark as fetched
    },
    addItemToCart: (state, action) => {
      state.items.push(action.payload);
    },
    deleteCartItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCartItems: (state) => {
      state.items = [];
      state.hasFetched = false;
    },
  },
});

export const { setCartItems, addItemToCart, clearCartItems, deleteCartItem } =
  cartItemSlice.actions;

export default cartItemSlice.reducer;
