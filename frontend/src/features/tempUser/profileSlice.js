import { createSlice } from "@reduxjs/toolkit";

//Initial state
const initialState = {
  profileId: "",
  bio: "",
  profilePicture: null,
  dateOfBirth: "",
};
/**
 * Slice for managing user related data including authentication status.
 */
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileInfo(state, action) {
      state.profileId = action.payload.profileId;
      state.bio = action.payload.bio;
      state.profilePicture = action.payload.profilePicture;
      state.dateOfBirth = action.payload.dateOfBirth;
    },
    clearProfileInfo(state) {
      state.profileId = "";
      state.bio = "";
      state.profilePicture = null;
      state.dateOfBirth = "";
    },
  },
});

export const { setProfileInfo, clearProfileInfo } = profileSlice.actions;
export default profileSlice.reducer;
