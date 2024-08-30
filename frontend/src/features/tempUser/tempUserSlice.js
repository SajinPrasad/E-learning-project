import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice for managing temporary user data (email) before authentication.
 * Setting the email address after registration, for OTP verification purpose.
 */
const tempUserSlice = createSlice({
  name: "tempUser",
  initialState: { email: "", role: "" }, // Initial state with an empty email
  reducers: {
    // Action to set the email address for OTP verification
    setTempUser(state, action) {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },

    // Action to clear the email address (after OTP verification)
    clearTempUser(state) {
      state.email = "";
      state.role = "";
    },
  },
});

export const { setTempUser, clearTempUser } = tempUserSlice.actions;
export default tempUserSlice.reducer;
