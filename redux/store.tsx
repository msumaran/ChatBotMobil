
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";
import thunk from 'redux-thunk';



import chatsReducer from './Slices/chatsSlice';
const rootReducer = combineReducers({
  chatsReducer,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Importa useDispatch de 'react-redux' aquí
