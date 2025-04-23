

import { USERS_DB } from "./data/dummy-data"

export async function getCurrentUser() {
  const userId = localStorage.getItem("userId")
  const user = USERS_DB.find((u) => u.id === userId);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role as "user" | "admin" | "superadmin",
  };
}

export async function loginUser(email: string, password: string) {
  const user = USERS_DB.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function signupUser(email: string, password: string) {
  const existingUser = USERS_DB.find((u) => u.email === email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = {
    id: (USERS_DB.length + 1).toString(),
    email,
    password,
    role: "user",
  };

  USERS_DB.push(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };
}


export async function logoutUser() {

}