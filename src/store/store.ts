import { configureStore, getDefaultMiddleware, combineReducers, Store, Action, Dispatch } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { filterSlice } from "./filterSlice";
import { productSlice } from "./productSlice";
import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Persistor } from "redux-persist";
import { pinSlice, longPinSlice } from "./pinSlice";
import { totalCountAnalysisSlice } from "./totalCountAnalysisSlice";
import { catCountSlice } from "./catCountSlice";

const persistConfig = {
  key: "root7",
  storage,
};

const rootReducer = combineReducers({
  [filterSlice.name]: filterSlice.reducer,
  [productSlice.name]: productSlice.reducer,
  [pinSlice.name]: pinSlice.reducer,
  [longPinSlice.name]: longPinSlice.reducer,
  [totalCountAnalysisSlice.name]: totalCountAnalysisSlice.reducer,
  [catCountSlice.name]: catCountSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

type AppStoreType = Store<RootState, Action<any>> & {
  persistor: Persistor;
  dispatch: ThunkDispatch<RootState, any, Action<any>> & Dispatch<Action<any>>;
};

const makeStore: MakeStore<AppStoreType> = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: false,
    }),
    devTools: true,
  });

  const persistor = persistStore(store);

  const enhancedStore: AppStoreType = {
    ...store,
    persistor,
    dispatch: store.dispatch,
  };

  return enhancedStore;
};

export type AppStore = AppStoreType;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<any>
>;
export type AppState = ReturnType<typeof rootReducer>;
export const wrapper = createWrapper<AppStore>(makeStore);





// const rootReducer = combineReducers({
//   [filterSlice.name]: filterSlice.reducer,
//   [productSlice.name]: productSlice.reducer,
//   [pinSlice.name]: pinSlice.reducer,
//   [longPinSlice.name]: longPinSlice.reducer,
// });

// export type RootState = ReturnType<typeof rootReducer>;

// type AppStoreType = Store<RootState, Action<any>> & {
//   dispatch: ThunkDispatch<RootState, any, Action<any>> & Dispatch<Action<any>>;
// };

// const makeStore: MakeStore<AppStoreType> = () => {
//   const store = configureStore({
//     reducer: rootReducer,
//     middleware: getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//     devTools: true,
//   });

//   return store;
// };

// export type AppStore = AppStoreType;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<any>
// >;
// export type AppState = ReturnType<typeof rootReducer>;
// export const wrapper = createWrapper<AppStore>(makeStore);