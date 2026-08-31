import { configureStore } from "@reduxjs/toolkit";
import qrContextReducer from "./slices/qrContextSlice";
import menuReducer from "./slices/menuSlice";

export const store = configureStore({
  reducer: {
    qrContext: qrContextReducer,
    menu: menuReducer,
  },
});
