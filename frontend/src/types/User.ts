export interface User {
  id: number;
  username: string;
  email: string;
  token?: string;
  role: "admin" | "trainer" | "client";
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  role: "trainer" | "client";
}
