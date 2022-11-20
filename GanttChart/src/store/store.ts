import { configureStore } from '@reduxjs/toolkit';
import project from './slices/ProjectSlice';

const store = configureStore({
  reducer: project,
});

export default store;

export type ProjectState = ReturnType<typeof project>;
export type AppDispatch = typeof store.dispatch;