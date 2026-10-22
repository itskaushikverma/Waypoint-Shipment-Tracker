import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: Boolean(storedToken),
  },
  reducers: {
    setAuthenticated(state, action) {
      state.isAuthenticated = Boolean(action.payload?.isAuthenticated);
      if (action.payload?.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    setUnauthenticated(state) {
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
