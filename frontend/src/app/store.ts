import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import trainerProfileReducer from "../features/trainerProfile/trainerProfileSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    trainerProfile: trainerProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
