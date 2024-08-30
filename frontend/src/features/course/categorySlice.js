import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "courseCategory",
  initialState: [],
  reducers: {
    setCategoryData(state, action) {
      return action.payload;
    },
    clearCategoryData() {
      return [];
    },
  },
});

export const { setCategoryData, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;
