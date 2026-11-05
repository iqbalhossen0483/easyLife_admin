import { Database, User } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  database: Database | null;
}

const initialState: AuthState = {
  user: null,
  database: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; database: Database }>,
    ) => {
      state.user = action.payload.user;
      state.database = action.payload.database;
    },
    logout: (state) => {
      state.user = null;
      state.database = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
