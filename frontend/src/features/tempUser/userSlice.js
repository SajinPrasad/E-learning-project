import { createSlice } from "@reduxjs/toolkit";

//Initial state
const initialState = {
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  isAuthenticated: false,
};
/**
 * Slice for managing user related data including authentication status.
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    clearUserInfo(state) {
      state.firstName = "";
      state.lastName = "";
      state.role = "";
      state.email = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
