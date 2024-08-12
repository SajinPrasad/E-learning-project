import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice for managing temporary user data (email) before authentication.
 * Setting the email address after registration, for OTP verification purpose.
 */
const tempUserSlice = createSlice({
  name: "tempUser",
  initialState: { email: "" }, // Initial state with an empty email
  reducers: {
    // Action to set the email address for OTP verification
    setEmail(state, action) {
      state.email = action.payload;
    },

    // Action to clear the email address (after OTP verification)
    clearEmail(state) {
      state.email = "";
    },
  },
});

export const { setEmail, clearEmail } = tempUserSlice.actions;
export default tempUserSlice.reducer;
