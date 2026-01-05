import api from "./axios";
import type { User } from "../types/User";

export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const signUpUser = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post("/register", data);
  return response.data;
};
