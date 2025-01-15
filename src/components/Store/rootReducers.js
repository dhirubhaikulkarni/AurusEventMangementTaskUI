import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import loginReducer from './loginSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    login: loginReducer
    // Add other reducers if you have them
  },
});

export default store;
