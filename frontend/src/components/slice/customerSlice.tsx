import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  customers: [],
  SelectedUserId: null,
  customerDetail: [],
  addedCustomer: {},
  deleteId: null,
  updatedCustomer: {},
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    initialCustomer: (state, action) => {
      state.customers = action.payload;
    },
    selectCustomer: (state, action) => {
      state.SelectedUserId = action.payload;
    },
    setCustomer: (state, action) => {
      state.customerDetail = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    addedCustomerData: (state, action) => {
      state.addedCustomer = action.payload;
    },
    deleteCustomerId: (state, action) => {
      state.deleteId = action.payload;
    },
    updateCustomerDetails: (state, action) => {
      state.updatedCustomer = action.payload;
    },
  },
});

export const {
  initialCustomer,
  selectCustomer,
  setCustomer,
  addCustomer,
  addedCustomerData,
  deleteCustomerId,
  updateCustomerDetails,
} = customerSlice.actions;
export default customerSlice.reducer;
