import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: [],
  reducers: {
    setCoursesState(state, action) {
      return action.payload;
    },
    clearCoursesState() {
      return [];
    },
  },
});

export const { setCoursesState, clearCoursesState } = courseSlice.actions;
export default courseSlice.reducer;
