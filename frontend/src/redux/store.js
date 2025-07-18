import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './productApi'

export const store = configureStore({
    reducer: {
       [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        [
            ...getDefaultMiddleware(),
            productApi.middleware,
        ],
})