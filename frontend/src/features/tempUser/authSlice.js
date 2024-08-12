import { createSlice } from "@reduxjs/toolkit";

//Initial state
const initialState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
