import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { postApi } from "./features/posts/postApi";
import authReducer from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, postApi.middleware),
});

export default store;
