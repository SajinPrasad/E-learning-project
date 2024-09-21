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

import {
  authReducer,
  cartItemReducer,
  courseCategoryReducer,
  courseReducer,
  enrolledCourseReducer,
  profileReducer,
  tempUserReducer,
  userReducer,
} from "../features";

// Configuration for tempUserReducer
const tempUserPersistConfig = {
  key: "tempUser", // unique key for this reducer
  storage, // storage method (localStorage in this case)
};

// Persisted reducer for tempUserReducer
const persistedTempUserReducer = persistReducer(
  tempUserPersistConfig,
  tempUserReducer,
);

// Configuration for user reducer
const userPersistConfig = {
  key: "user",
  storage,
};

// Persisted reducer for userReducer
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Configuration for auth reducer
const authPersistConfig = {
  key: "auth",
  storage,
};

// Persisted reducer for authReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configuration for category reducer
const categoryPersistConfig = {
  key: "courseCategory",
  storage,
};

const persistedCategoryReducer = persistReducer(
  categoryPersistConfig,
  courseCategoryReducer,
);

const coursePersistConfig = {
  key: "course",
  storage,
};

const persistedCourseReducer = persistReducer(
  coursePersistConfig,
  courseReducer,
);

const enrolledCoursePersistConfig = {
  key: "enrolledCourse",
  storage,
};

const persistedEnrolledCourseReducer = persistReducer(
  enrolledCoursePersistConfig,
  enrolledCourseReducer,
);

const cartItemPersistConfig = {
  key: "cartItem",
  storage,
};

const persistedCartItemReducer = persistReducer(
  cartItemPersistConfig,
  cartItemReducer,
);

const profilePersistConfig = {
  key: "profile",
  storage,
};

const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer,
);

// Combine your reducers
const rootReducer = combineReducers({
  tempUser: persistedTempUserReducer,
  user: persistedUserReducer,
  auth: persistedAuthReducer,
  courseCategory: persistedCategoryReducer,
  course: persistedCourseReducer,
  cartItem: persistedCartItemReducer,
  enrolledCourse: persistedEnrolledCourseReducer,
  profile: persistedProfileReducer,
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
