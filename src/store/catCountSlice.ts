import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { CategoryCounts } from "@/interfaces/cat_count_interface";
import { Product } from "@/interfaces/product_interface";

// Type for our state
export interface CatCountState {
  catCount: CategoryCounts;
  totalCount:number;
}

// Initial state
const initialCatCountState: CatCountState = {
  catCount: {} as CategoryCounts,
  totalCount:0,
};

// Actual Slice
export const catCountSlice = createSlice({
  name: "cat_count",
  initialState: initialCatCountState,
  reducers: {
    updateCatCountState: (state, action: PayloadAction<Product>) => {
      try{
        const category = action.payload.Category;
        if (state.catCount.hasOwnProperty(category)) {
          state.catCount[category] += 1;
        } else {
          state.catCount[category] = 1;
        }
        state.totalCount = state.totalCount + 1;
      }
      catch(err){
        console.error("CatCountSlice Error", err)
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

export const { updateCatCountState } = catCountSlice.actions;

export const selectCatCount = (state: AppState) => state.cat_count.catCount;
export const selectTotalCatCount = (state: AppState) => state.cat_count.totalCount;
export const selectUniqueCategoryCount = (state: AppState) => Object.keys(state.cat_count.catCount).length;

export default catCountSlice.reducer;
