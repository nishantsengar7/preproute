import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import testsReducer from './tests/testsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tests: testsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings stored in currentTest — they are serializable as strings
        ignoredPaths: ['tests.currentTest.createdAt', 'tests.currentTest.updatedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
