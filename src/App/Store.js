// store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AllReducer from '../ReduxToolKit/AllSlice';
import createTransform from 'redux-persist/es/createTransform';
import adminProductReducer from '../ReduxToolKit/AdminSlice'


const excludeProductsByCategoryTransform = createTransform(
  (inboundState) => {
    const { productsByCategory, ...rest } = inboundState;
    return rest;
  },
  (outboundState) => outboundState,
  { whitelist: ['AllStore'] }
);

const persistConfig = {
  key: 'Flipkart',
  storage,
  transforms: [excludeProductsByCategoryTransform],
};


const rootReducer = combineReducers({
  AllStore: AllReducer,
  adminProduct: adminProductReducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
