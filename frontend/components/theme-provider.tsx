"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.setAttribute(attribute, isDark ? "dark" : "light")
    } else if (theme) {
      root.setAttribute(attribute, theme)
    }
  }, [theme, attribute])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
