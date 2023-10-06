import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Pin } from "../interfaces/pin_interface";
import { AppState } from "./store";
import { Analysis } from "@/interfaces/analysis_interface";

interface AnalysisState {
  totalCountAnalysis: Analysis;
}

const initialState: AnalysisState = {
  totalCountAnalysis: {
    Title:"Number of Products",
    Value:"0"
  } as Analysis,
};

export const totalCountAnalysisSlice = createSlice({
  name: "total_count_analysis",
  initialState,
  reducers: {
    increaseCount: (state) => {
      try{
        const newCount = Number(state.totalCountAnalysis.Value) + 1;
      state.totalCountAnalysis.Value = newCount.toString();
      }
      catch(err){
        console.error("Total Count Analysis Error: ", err)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE as any, (state, action) => {
      return {
        ...state,
        ...action.payload.pin,
      };
    });
  },
});

export const { increaseCount } = totalCountAnalysisSlice.actions;

export const selectTotalCountAnalysis = (state: AppState) => state.total_count_analysis.totalCountAnalysis;

export default totalCountAnalysisSlice.reducer;

