import { useSelector, useDispatch} from "react-redux";
import { Dispatch ,Selector} from "@reduxjs/toolkit";
import { addProduct, selectProducts } from "@/store/productSlice"; 
import { addLongPin, addPin, removeLongPin, removePin, selectLongPins, selectPins } from "@/store/pinSlice";
import {v4 as uuidv4} from 'uuid';
import { Product } from "@/interfaces/product_interface";
import { Pin } from "@/interfaces/pin_interface";
import { increaseCount } from "@/store/totalCountAnalysisSlice";




const PIN_TIMEOUT_SHORT = 3000;
const PIN_TIMEOUT_LONG = 30000;

export const filterExpiredPins=(pins:Pin[],dispatch :Dispatch)=>{
  try{
    pins.map((pin)=>{
      if(pin.expirationTime && pin.id && pin.expirationTime < Date.now()){
          dispatch(removePin(pin.id));
          dispatch(removeLongPin(pin.id));
      }
  })
  }
  catch(err){
    console.error("UpdateProductsService Error: ", err)
  }
    
}


export const updateProducts = (product: Product,pins:Pin[],dispatch :Dispatch) => {
  try{
    dispatch(increaseCount())
    const currentTime = new Date()
    const newProduct: Product = { ...product, id: uuidv4(), acqTimestamp: currentTime};
    dispatch(addProduct(newProduct));

    const { id,Barcode,ProductName,Category, Location } = newProduct;
    const existingPin = pins.find((pin) => pin.productId === id);

    if (!existingPin) {
      const pinWithShortTimeout: Pin = {
        id:uuidv4(),
        productId:id,
        Barcode,
        X: Location[0],
        Y: Location[1],
        Category,
        ProductName,
        timeoutId: undefined,
        expirationTime:Date.now()+PIN_TIMEOUT_SHORT
      };
      const pinWithLongTimeout: Pin = {
        id:uuidv4(),
        productId:id,
        Barcode,
        X: Location[0],
        Y: Location[1],
        Category,
        ProductName,
        timeoutId: undefined,
        expirationTime:Date.now()+PIN_TIMEOUT_LONG
      };
      dispatch(addPin(pinWithShortTimeout));
      dispatch(addLongPin(pinWithLongTimeout));

    }
  }
  catch(err){
    console.error("UpdateProductsService Error: ", err)
  }
     

  };
