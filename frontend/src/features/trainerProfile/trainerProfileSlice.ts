import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TrainerProfileDetail {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  joined: string;
  experience: string;
  bio: string;
  specialties: string[];
  profileStats: {
    views: number;
    rating: number;
    reviews: number;
    responseRate: string;
  };
  certifications: Array<{
    title: string;
    expires: string;
  }>;
  availability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  reviews: Array<{
    author: string;
    rating: number;
    time: string;
    content: string;
  }>;
}

interface TrainerProfileState {
  profile: TrainerProfileDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrainerProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const trainerProfileSlice = createSlice({
  name: "trainerProfile",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfile: (state, action: PayloadAction<TrainerProfileDetail>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<TrainerProfileDetail>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setLoading, setProfile, updateProfile, setError, clearProfile } =
  trainerProfileSlice.actions;
export default trainerProfileSlice.reducer;

