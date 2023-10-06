import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface FilterState {
    filterState: string[];
}

// Initial state
const initialFilterState: FilterState = {
    filterState: [],
};

// Actual Slice
export const filterSlice = createSlice({
  name: "filter",
  initialState:initialFilterState,
  reducers: {
    // Action to set the authentication status
    setFilterState(state, action) {
      try{
        if(state.filterState.includes(action.payload)){
          const index = state.filterState.indexOf(action.payload)
          state.filterState.splice(index,1)
        }else{
          state.filterState.push(action.payload);
        }
      }
      catch(err){
        console.error("FilterSlice Error", err)
      }
      
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setFilterState } = filterSlice.actions;

export const selectFilterState = (state: AppState) => state.filter.filterState;

export default filterSlice.reducer;