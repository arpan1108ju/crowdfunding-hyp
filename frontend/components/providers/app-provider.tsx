"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser } from "@/lib/auth"

type User = {
  id: string
  email: string
  role: "user" | "admin" | "superadmin"
}

type AppContextType = {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser()
      // console.log(res)
      // const userData = await res.json()
      console.log(userData)
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return <AppContext.Provider value={{ user, loading, refreshUser }}>{children}</AppContext.Provider>
}

export function useAuth() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AppProvider")
  }
  return context
}
