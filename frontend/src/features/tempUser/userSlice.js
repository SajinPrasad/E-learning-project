import { createSlice } from "@reduxjs/toolkit";

//Initial state
const initialState = {
  firstName: "",
  lastName: "",
  role: "",
  email: "",
};
/**
 * Slice for managing user related data including tokens after authentication.
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
    },
    clearUserInfo(state) {
      state.firstName = "";
      state.lastName = "";
      state.role = "";
      state.email = "";
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
