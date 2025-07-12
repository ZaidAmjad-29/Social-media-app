import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { postApi } from "./features/posts/postApi";
import { friendsApi } from "./features/friends/friendsApi";
import authReducer from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [friendsApi.reducerPath]: friendsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postApi.middleware,
      friendsApi.middleware
    ),
});

export default store;
