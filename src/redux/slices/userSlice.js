import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  sessionExpired: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      try {
        state.user = action.payload;
      } catch (err) {
        console.log(err);
      }
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
    },
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
    },
  },
});

export const { setUserDetails, setSessionExpired, clearSessionExpired } = userSlice.actions;
export default userSlice.reducer;
