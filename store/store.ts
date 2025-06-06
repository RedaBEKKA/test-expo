import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"
import { apiSlice } from "./api/apiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// Types déduits pour RootState et AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
