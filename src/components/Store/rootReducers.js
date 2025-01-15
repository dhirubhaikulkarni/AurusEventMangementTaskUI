import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import loginReducer from './loginSlice';
import eventReducer from './eventManagementSlice';

const store = configureStore({
  reducer: {
    event: eventReducer,
    user: userReducer,
    login: loginReducer
    // Add other reducers if you have them
  },
});

export default store;
