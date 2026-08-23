import { configureStore } from '@reduxjs/toolkit'
import { platformAuthSlice } from './platformAuthSlice'

export const store = configureStore({
  reducer: {
    platformAuth: platformAuthSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
