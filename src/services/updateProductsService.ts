import { useSelector, useDispatch } from "react-redux";
import { Dispatch, Selector } from "@reduxjs/toolkit";
import { addProduct, selectProducts } from "@/store/productSlice";
import {
  addLongPin,
  addPin,
  removeLongPin,
  removePin,
  selectLongPins,
  selectPins,
} from "@/store/pinSlice";
import { v4 as uuidv4 } from "uuid";
import { Product } from "@/interfaces/product_interface";
import { Pin } from "@/interfaces/pin_interface";
import { increaseCount } from "@/store/totalCountAnalysisSlice";

const PIN_TIMEOUT_SHORT = 3000;
const PIN_TIMEOUT_LONG = 30000;

export const filterExpiredPins = (pins: Pin[], dispatch: Dispatch) => {
  try {
    pins.map((pin) => {
      if (pin.expirationTime && pin.id && pin.expirationTime < Date.now()) {
        dispatch(removePin(pin.id));
        dispatch(removeLongPin(pin.id));
      }
    });
  } catch (err) {
    console.error("UpdateProductsService Error: ", err);
  }
};

export const updateProducts = (
  product: Product,
  pins: Pin[],
  dispatch: Dispatch
) => {
  try {
    dispatch(increaseCount());
    const isMissing = (value: any) => value === undefined || value === null || value === '';

    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      Barcode: isMissing(product.Barcode) ? "0" : product.Barcode,
      ProductName: isMissing(product.ProductName)
        ? "Product"
        : product.ProductName,
      Category: isMissing(product.Category) ? "None" : product.Category,
    };

    if (
      !isMissing(product.Location) &&
      Array.isArray(product.Location) &&
      product.Location.length === 2
    ) {
      const [latitude, longitude] = product.Location;
      newProduct.Location = [
        isMissing(latitude) ? 0 : latitude,
        isMissing(longitude) ? 0 : longitude,
      ];
    } else {
      // Set default values for latitude and longitude
      newProduct.Location = [0, 0];
    }

    if (newProduct.Location[0] !== 0 && newProduct.Location[1] !== 0) {
      dispatch(addProduct(newProduct));

      const { id, Barcode, ProductName, Category, Location } = newProduct;
      const existingPin = pins.find((pin) => pin.productId === id);

      if (!existingPin) {
        const pinWithShortTimeout: Pin = {
          id: uuidv4(),
          productId: id,
          Barcode,
          X: Location[0],
          Y: Location[1],
          Category,
          ProductName,
          timeoutId: undefined,
          expirationTime: Date.now() + PIN_TIMEOUT_SHORT,
        };
        const pinWithLongTimeout: Pin = {
          id: uuidv4(),
          productId: id,
          Barcode,
          X: Location[0],
          Y: Location[1],
          Category,
          ProductName,
          timeoutId: undefined,
          expirationTime: Date.now() + PIN_TIMEOUT_LONG,
        };
        dispatch(addPin(pinWithShortTimeout));
        dispatch(addLongPin(pinWithLongTimeout));
      }
    }
  } catch (err) {
    console.error("UpdateProductsService Error: ", err);
  }
};
