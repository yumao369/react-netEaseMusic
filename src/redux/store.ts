import { combineReducers, configureStore } from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage';
import playReducer from './playerSlice'

const reducers = combineReducers({
  playReducer
})

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDisPatch = typeof store.dispatch

export default store