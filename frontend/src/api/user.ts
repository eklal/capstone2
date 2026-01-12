import api from "./axios";
import type { User, LoginCredentials, SignUpData } from "../types/User";

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post("/api/token/", credentials);
  return response.data;
};

export const signUpUser = async (data: SignUpData): Promise<User> => {
  const response = await api.post("/api/register/", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/api/me/");
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    await api.post("/api/logout/", { refresh_token: refreshToken });
  } catch (error) {
    // Even if the API call fails, we'll clear the local storage
    console.error("Logout API error:", error);
  }
};
