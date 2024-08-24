import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  searchName: "",
  searchData: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchFirstName: (state, action) => {
      state.searchName = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
  },
});

export const { searchFirstName, setSearchData } = searchSlice.actions;
export default searchSlice.reducer;
