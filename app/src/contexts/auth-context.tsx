"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_URL } from "@/services/api"
import { toast } from "sonner"

type User = {
  id: number
  username: string
  is_staff: boolean
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// API functions
const fetchCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to fetch user")
  }

  return response.json()
}

const loginUser = async ({ username, password }: { username: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Invalid credentials")
  }

  return response.json()
}

const registerUser = async ({ username, password }: { username: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Registration failed")
  }

  return response.json()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"))
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // User query
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) return null
      try {
        return await fetchCurrentUser(token)
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("token")
        setToken(null)
        throw error
      }
    },
    enabled: !!token,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token)
      setToken(data.access_token)
      queryClient.invalidateQueries({ queryKey: ["user"] })
      navigate("/dashboard")
      toast("Welcome back!")
    },
    onError: (error: Error) => {
      toast(error.message || "An error occurred. Please try again.")
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast("You can now log in with your credentials")
      navigate("/login")
    },
    onError: (error: Error) => {
      toast(error.message || "An error occurred. Please try again.")
    },
  })

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password })
  }

  const register = async (username: string, password: string) => {
    await registerMutation.mutateAsync({ username, password })
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    queryClient.clear()
    navigate("/login")
    toast("You have been successfully logged out")
  }

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        token,
        login,
        register,
        logout,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

