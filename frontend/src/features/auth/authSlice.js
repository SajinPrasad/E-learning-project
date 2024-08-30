import { createSlice } from "@reduxjs/toolkit";

const initialState = { accessToken: null, refreshToken: null };

//Slice for storing the authentication tokens.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    clearToken(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
