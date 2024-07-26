// adminProductSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminProduct: [],
  productDetail:""
};

export const adminProductSlice = createSlice({
  name: 'adminProduct',
  initialState,
  reducers: {
    addAdminProduct: (state, action) => {
      state.adminProduct.push(...action.payload);
    },
    addProductDetails:(state,action)=>{
      state.productDetail=action.payload
    }
  },
});

export const { addAdminProduct,addProductDetails } = adminProductSlice.actions;
export default adminProductSlice.reducer;
