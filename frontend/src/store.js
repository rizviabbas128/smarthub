import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./components/slice/customerSlice";
import searchReducer from './components/slice/searchSlice';

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    search: searchReducer,
  },
});

export default store;
