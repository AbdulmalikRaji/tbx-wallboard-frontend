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
const MAX_SENT_PRODUCTS = 60;
const sentProductIds = new Set<string>();


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
  products: Product[],
  pins: Pin[],
  dispatch: Dispatch
) => {
  try {
    for (const product of products) {
      if (!sentProductIds.has(product.id)) {
        if (sentProductIds.size >= MAX_SENT_PRODUCTS) {
          // Remove the oldest product IDs when reaching the maximum size
          const keysIterator = sentProductIds.keys();
          for (let i = 0; i < sentProductIds.size - MAX_SENT_PRODUCTS; i++) {
            const oldestProductId = keysIterator.next().value;
            sentProductIds.delete(oldestProductId);
          }
        }

        // Product is new, process it
        sentProductIds.add(product.id);
        dispatch(increaseCount());
        const isMissing = (value: any) => value === undefined || value === null || value === '';

        const newProduct = {
          ...product,
          id: uuidv4(),
          Barcode: isMissing(product.Barcode) ? "0" : product.Barcode,
          ProductName: isMissing(product.ProductName) ? "Product" : product.ProductName,
          Category: isMissing(product.Category) ? "None" : product.Category,
        };

        if (!isMissing(product.Location) && Array.isArray(product.Location) && product.Location.length === 2) {
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
            const pinWithShortTimeout = {
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
            const pinWithLongTimeout = {
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
      }
    }
  } catch (err) {
    console.error("UpdateProductsService Error: ", err);
  }
};