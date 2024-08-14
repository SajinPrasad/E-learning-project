import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/es/constants";

import { tempUserReducer, userReducer } from "../features";

// Configuration for tempUserReducer
const tempUserPersistConfig = {
  key: "tempUser", // unique key for this reducer
  storage, // storage method (localStorage in this case)
};

// Configuration for user reducer
const userPersistConfig = {
  key: "user",
  storage,
};

// Persisted reducer for tempUserReducer
const persistedTempUserReducer = persistReducer(
  tempUserPersistConfig,
  tempUserReducer,
);

// Persisted reducer for userReducer
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Combine your reducers
const rootReducer = combineReducers({
  tempUser: persistedTempUserReducer,
  user: persistedUserReducer,
});

// Configure store with reducers and middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
