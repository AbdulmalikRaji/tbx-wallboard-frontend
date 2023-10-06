import { Product } from "@/interfaces/product_interface";
import { updateCatCountState } from "@/store/catCountSlice";
import { Dispatch } from "@reduxjs/toolkit";

export const updateStats = (product: Product,dispatch :Dispatch) => {
    try{
        dispatch(updateCatCountState(product))
    }
    catch(err){
      console.error("UpdateProductsService Error: ", err)
    }
    
};