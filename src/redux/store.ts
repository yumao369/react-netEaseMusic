import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import playReducer from "./playerSlice";
import memberReducer from "./memberSlice"

const reducers = combineReducers({
  playReducer,
  memberReducer
});

//const persistConfig = {
//  key: 'root',
//  storage
//};

//const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  //reducer: persistedReducer,
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDisPatch = typeof store.dispatch;

export default store;
