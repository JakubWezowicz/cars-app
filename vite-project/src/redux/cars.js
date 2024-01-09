import { createSlice } from "@reduxjs/toolkit";

export const carSlice = createSlice({
  name: "car-data",
  initialState: {
    carsData: [],
  },
  reducers: {
    setCars: (state, action) => {
      state.carsData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCars } = carSlice.actions;

export default carSlice.reducer;
