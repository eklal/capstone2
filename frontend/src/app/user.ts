import axios from "axios";
import type { User } from "../types/User";

const API_BASE_URL = "https://your-api-domain.com"; // replace with your backend URL

interface LoginPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const signUpUser = async ({ name, email, password }: SignUpPayload): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
  return response.data;
};
