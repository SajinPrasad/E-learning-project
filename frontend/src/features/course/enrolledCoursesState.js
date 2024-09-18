import { createSlice } from "@reduxjs/toolkit";

const enrolledCourseSlice = createSlice({
  name: "enrolledCourse",
  initialState: [],
  reducers: {
    setEnrolledCoursesState(state, action) {
      return action.payload;
    },
    clearEnrolledCoursesState() {
      return [];
    },
  },
});

export const { setEnrolledCoursesState, clearEnrolledCoursesState } =
  enrolledCourseSlice.actions;
export default enrolledCourseSlice.reducer;
