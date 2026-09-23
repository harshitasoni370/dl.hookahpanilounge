import { configureStore } from "@reduxjs/toolkit";
import qrContextReducer from "./slices/qrContextSlice";
import menuReducer from "./slices/menuSlice";
import gamesReducer from "./slices/gamesSlice";
import customMomentsReducer from "./slices/customMomentsSlice";
import celebrationPackagesReducer from "./slices/celebrationPackagesSlice";
import membershipReducer from "./slices/membershipSlice";
import reservationReducer from "./slices/reservationSlice";
import headerModulesReducer from "./slices/modulesSlice";
import cardModuleReducer from "./slices/cardModuleSlice";
import packageModuleReducer from "./slices/packageSlice";

export const store = configureStore({
  reducer: {
    qrContext: qrContextReducer,
    menu: menuReducer,
    games: gamesReducer,
    customMoments: customMomentsReducer,
    celebrationPackages: celebrationPackagesReducer,
    membership: membershipReducer,
    reservation: reservationReducer,
    headerModules: headerModulesReducer,
    cardModule: cardModuleReducer,
    packageModule: packageModuleReducer,
  },
});
