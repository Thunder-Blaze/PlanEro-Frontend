"use client"

import { useSession } from "next-auth/react"
import { authApi, vendorApi } from "@/lib/api"
import { useEffect, useState } from "react"

// Hook to get and manage API token
export function useApiToken() {
  const { data: session } = useSession()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check session for API token
    if (session?.apiToken) {
      setToken(session.apiToken)
      return
    }

    // Check localStorage for token
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      setToken(storedToken)
      return
    }

    setToken(null)
  }, [session])

  return token
}

// Hook for API calls with authentication
export function useApiCalls() {
  const token = useApiToken()

  const authenticatedApiCall = async <T>(
    apiFunction: (token: string) => Promise<T>
  ): Promise<T | null> => {
    if (!token) {
      throw new Error("No authentication token available")
    }

    try {
      return await apiFunction(token)
    } catch (error) {
      console.error("API call failed:", error)
      throw error
    }
  }

  return {
    token,
    getProfile: () => authenticatedApiCall(authApi.getProfile),
    updateVendor: (id: number, data: any) => 
      authenticatedApiCall((token) => vendorApi.updateVendor(id, data, token)),
  }
}
