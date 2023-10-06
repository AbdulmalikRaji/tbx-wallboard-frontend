import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Product } from "../interfaces/product_interface";
import { AppState } from "./store";

const MAX_PRODUCTS = 60;

// Type for our state
export interface ProductState {
  products: Product[];
}

// Initial state
const initialProductState: ProductState = {
  products: [],
};

// Actual Slice
export const productSlice = createSlice({
  name: "product",
  initialState: initialProductState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      try{
        state.products = action.payload;
      }
      catch(err){
        console.error("productSlice error",err)
      }
      
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      try{
        state.products.unshift(action.payload);
        state.products = state.products.slice(0, MAX_PRODUCTS);
        var latestProduct = state.products[state.products.length - 1]?.ProductName;
        console.log("product:", latestProduct)
        //logger.info(latestProduct + " scanned")
      }
      catch(err){
        console.error("productSlice error",err)
      }
      
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE as any, (state, action) => {
      // Merge the incoming state with the existing state
      return {
        ...state,
        ...action.payload.product,
      };
    });
  },
});

export const { setProducts, addProduct } = productSlice.actions;

export const selectProducts = (state: AppState) => state.product.products;

export default productSlice.reducer;
