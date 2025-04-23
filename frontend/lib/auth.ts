// "use server"

// import { cookies } from "next/headers"
// import { USERS_DB } from "./data/dummy-data"


// // This would be replaced with actual database queries
// global const userId=null;
// export async function getCurrentUser() {
//   // const userId = (await cookies()).get("userId")?.value

//   if (!userId) {
//     return null
//   }

//   const user = USERS_DB.find((u) => u.id === userId)

//   if (!user) {
//     return null
//   }

//   return {
//     id: user.id,
//     email: user.email,
//     role: user.role as "user" | "admin" | "superadmin",
//   }
// }

// export async function loginUser(email: string, password: string) {
//   // In a real app, you would hash the password and check against the database
//   const user = USERS_DB.find((u) => u.email === email && u.password === password)
//   userId=user.id;
//   if (!user) {
//     throw new Error("Invalid credentials")
//   }

//   console.log(user)

//   return {
//     id: user.id,
//     email: user.email,
//     role: user.role,
//   }
// }
//   // Set a cookie to maintain the session
//   // (await cookies()).set("userId", user.id, {
//   //   httpOnly: true,
//   //   secure: process.env.NODE_ENV === "production",
//   //   maxAge: 60 * 60 * 24 * 7, // 1 week
//   //   path: "/",
//   // })

// export async function signupUser(email: string, password: string) {
//   // Check if user already exists
//   const existingUser = USERS_DB.find((u) => u.email === email)

//   if (existingUser) {
//     throw new Error("User already exists")
//   }

//   // In a real app, you would hash the password and store in the database
//   const newUser = {
//     id: (USERS_DB.length + 1).toString(),
//     email,
//     password,
//     role: "user",
//   }

//   // Add user to the database (simulated)
//   USERS_DB.push(newUser)

//   // Set a cookie to maintain the session
//   // ;(await cookies()).set("userId", newUser.id, {
//   //   httpOnly: true,
//   //   secure: process.env.NODE_ENV === "production",
//   //   maxAge: 60 * 60 * 24 * 7, // 1 week
//   //   path: "/",
//   // })

//   return {
//     id: newUser.id,
//     email: newUser.email,
//     role: newUser.role,
//   }
// }

// export async function logoutUser() {
//   (await cookies()).delete("userId")
// }


"use server"

import { cookies } from "next/headers"
import { USERS_DB } from "./data/dummy-data"
export {}

declare global {
  var userSession: {
    userId: string | null
  }
}

// Declare globalThis.userSession
if (!globalThis.userSession) {
  globalThis.userSession = {
    userId: null,
  }
}

export async function getCurrentUser() {
  const userId = globalThis.userSession.userId;

  if (!userId) {
    return null;
  }

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

  globalThis.userSession.userId = user.id;

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
  globalThis.userSession.userId = newUser.id;

  return {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };
}

export async function logoutUser() {
  globalThis.userSession.userId = null;
}
