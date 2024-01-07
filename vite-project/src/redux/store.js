import { configureStore } from "@reduxjs/toolkit";
import carsReducer from "./cars";

export default configureStore({
  reducer: {
    cars: carsReducer,
  },
});
