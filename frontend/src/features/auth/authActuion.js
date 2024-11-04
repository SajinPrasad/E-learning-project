import { createAsyncThunk } from "@reduxjs/toolkit";

import { clearUserInfo } from "../tempUser/userSlice";
import { clearToken } from "./authSlice";
import { clearCartItems } from "../cartItem/cartItemSlice";
import { clearCoursesState } from "../course/courseSlice";
import { clearTempUser } from "../tempUser/tempUserSlice";
import { clearEnrolledCoursesState } from "../course/enrolledCoursesState";
import { clearProfileInfo } from "../tempUser/profileSlice";
import { userLogoutService } from "../../services/userManagementServices/authService";

/**
 * Async thunk for handling user logout.
 *
 * This function:
 * 1. Retrieves the refresh token from the state.
 * 2. Calls the `userLogoutService` with the refresh token to perform a logout action.
 * 3. If the logout is successful, it dispatches multiple actions to clear user-related data
 *    from the Redux state (user info, tokens, cart items, enrolled courses, etc.) in parallel.
 * 4. Returns a boolean (`loggedOut`) indicating the success or failure of the logout.
 *
 * @async
 * @function logoutUser
 * @param {Object} _ - Ignored argument, as no input is needed.
 * @param {Object} thunkAPI - Contains dispatch and getState functions from Redux.
 * @param {Function} thunkAPI.dispatch - Used to dispatch actions for clearing states.
 * @param {Function} thunkAPI.getState - Used to retrieve the refresh token from the Redux state.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the logout is successful, otherwise `false`.
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, getState }) => {
    const refreshToken = getState().auth.refreshToken;

    // Perform logout service call
    const loggedOut = await userLogoutService(refreshToken);
    if (loggedOut) {
      // Clear states
      await Promise.all([
        dispatch(clearUserInfo()),
        dispatch(clearToken()),
        dispatch(clearCartItems()),
        dispatch(clearCoursesState()),
        dispatch(clearTempUser()),
        dispatch(clearEnrolledCoursesState()),
        dispatch(clearProfileInfo()),
      ]);
    }

    return loggedOut;
  },
);
