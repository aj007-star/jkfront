import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  categoryPage: null,
  addToCart: [],
  productdetail: {},
  userAddress: {}
};

export const AllSlice = createSlice({
  name: 'AllSlice',
  initialState,
  reducers: {
    addCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategoryPage: (state, action) => {
      state.categoryPage = action.payload;
    },
    addProductToCart: (state, action) => {
      const {
        productId,
        productName,
        price,
        subprice,
        color,
        size,
        selectedSize,
        selectedColor,
        productImages
      } = action.payload;

      const finalSize = selectedSize || size;
      const finalColor = selectedColor || color;

      const productExists = state.addToCart.some(product => product.productId === productId);
      if (!productExists) {
        state.addToCart.push({
          productId,
          productName,
          price,
          subprice,
          color: finalColor,
          size: finalSize,
          quantity: 1,
          mainImage: productImages[0]
        });
      }
    },
    removeAddToCartProduct: (state, action) => {
      const index = state.addToCart.findIndex(item => item.productId === action.payload);
      if (index !== -1) {
        state.addToCart.splice(index, 1);
      }
    },
    updateAddCartProduct: (state, action) => {
      const { quantity, productId } = action.payload;
      const updatedProduct = state.addToCart.map(product => {
        if (product.productId === productId) {
          return { ...product, quantity }
        } else {
          return product
        }
      });
      state.addToCart=updatedProduct;
    },
    addProductDetail: (state, action) => {
      state.productdetail = action.payload
    },
    addUserAddress: (state, action) => {
      state.userAddress = action.payload
    },
    clearState: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { addCategories, addCategoryPage, addProductToCart, addProductDetail, addUserAddress, removeAddToCartProduct,updateAddCartProduct,clearState } = AllSlice.actions;

export default AllSlice.reducer;
