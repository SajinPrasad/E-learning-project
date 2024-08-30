import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: [],
  reducers: {
    setCourses(state, action) {
      return action.payload;
    },
    clearCourses() {
      return [];
    },
  },
});

export const { setCourses, clearCourses } = courseSlice.actions;
export default courseSlice.reducer;
