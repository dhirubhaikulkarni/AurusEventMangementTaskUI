import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Initialize with null instead of an empty array
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    ResetUser: (state, action) => {
      state.user = null;
    },
  },
});

export const { SetUser , ResetUser} = userSlice.actions;
export const getUser = (state) => state.user.user;
export default userSlice.reducer;
