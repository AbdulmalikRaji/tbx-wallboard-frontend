import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Pin } from "../interfaces/pin_interface";
import { AppState } from "./store";

interface PinState {
  pins: Pin[];
}

const initialState: PinState = {
  pins: [],
};

export const pinSlice = createSlice({
  name: "pin",
  initialState,
  reducers: {
    addPin: (state, action: PayloadAction<Pin>) => {
      try{
        const { id, X, Y } = action.payload;
        const existingPin = state.pins.find((pin) => pin.id === id);
  
        if (!existingPin) {
          const newPin: Pin = {
            ...action.payload,
            timeoutId: undefined,
          };
          state.pins.push(newPin);
        } else {
          existingPin.X = X;
          existingPin.Y = Y;
        }
      }
      catch(err){
        console.error("PinSlice Error", err)
      }
    },
    removePin: (state, action: PayloadAction<string>) => {
      try{
        state.pins = state.pins.filter((pin) => pin.id !== action.payload);
      }
      catch(err){
        console.error("PinSlice Error", err)
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

export const { addPin, removePin } = pinSlice.actions;

export const selectPins = (state: AppState) => state.pin.pins;

export default pinSlice.reducer;

export const longPinSlice = createSlice({
  name: "longPin",
  initialState,
  reducers: {
    addLongPin: (state, action: PayloadAction<Pin>) => {
      try{
        const { id, X, Y } = action.payload;
        const existingPin = state.pins.find((pin) => pin.id === id);

        if (!existingPin) {
          const newPin: Pin = {
            ...action.payload,
            timeoutId: undefined,
          };
          state.pins.push(newPin);
        } else {
          existingPin.X = X;
          existingPin.Y = Y;
        }
      }
      catch(err){
        console.error("PinSlice Error", err)
      }
      
    },
    removeLongPin: (state, action: PayloadAction<string>) => {
      try{
        state.pins = state.pins.filter((pin) => pin.id !== action.payload);
      }
      catch(err){
        console.error("PinSlice Error", err)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE as any, (state, action) => {
      return {
        ...state,
        ...action.payload.longPin,
      };
    });
  },
});

export const { addLongPin, removeLongPin } = longPinSlice.actions;

export const selectLongPins = (state: AppState) => state.longPin.pins;
