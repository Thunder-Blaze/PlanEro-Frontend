// API utility functions for interacting with the external backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://16.170.172.178:8080'

// Types based on the OpenAPI specification
export interface SignupRequest {
  role: 'USER' | 'VENDOR'
  username: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
  message: string
}

export interface Vendor {
  id: number
  businessName: string
  location: string
  bio: string
  websiteUrl: string[]
  profilePictureUrl: string
  email: string
  phoneNumber: string
  addressId: number
  approved: boolean
  published: boolean
}

export interface Profile {
  username: string
  email: string
  phone: string
  role: 'USER' | 'VENDOR'
  vendor?: Vendor
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Token management
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USERNAME_KEY = 'username'
  private static readonly USER_DATA_KEY = 'user_data'

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USERNAME_KEY)
      localStorage.removeItem(this.USER_DATA_KEY)
    }
  }

  static setUsername(username: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERNAME_KEY, username)
    }
  }

  static getUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.USERNAME_KEY)
    }
    return null
  }

  static setUserData(userData: Profile): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData))
    }
  }

  static getUserData(): Profile | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.USER_DATA_KEY)
      return data ? JSON.parse(data) : null
    }
    return null
  }
}

// Enhanced API call function with retry logic and better error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
  retries = 1
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        let errorCode = response.status.toString()
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          errorCode = errorData.code || errorCode
        } catch {
          // If response is not JSON, use default error message
        }
        
        throw new ApiError(response.status, errorMessage, errorCode)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      } else {
        return {} as T
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (attempt === retries) {
        throw new ApiError(
          0,
          error instanceof Error ? error.message : 'Network error occurred'
        )
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  throw new ApiError(0, 'Maximum retries exceeded')
}

// Auth API functions
export const authApi = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Store token and username after successful signup
    TokenManager.setToken(response.token)
    TokenManager.setUsername(response.username)
    
    return response
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Store token and username after successful login
    TokenManager.setToken(response.token)
    TokenManager.setUsername(response.username)
    
    return response
  },

  async getProfile(token?: string): Promise<Profile> {
    const authToken = token || TokenManager.getToken()
    if (!authToken) {
      throw new ApiError(401, 'No authentication token found')
    }
    
    const profile = await apiCall<Profile>('/auth/profile', {
      method: 'GET',
    }, authToken)
    
    // Store user data for quick access
    TokenManager.setUserData(profile)
    
    return profile
  },

  async logout(): Promise<void> {
    TokenManager.removeToken()
  },

  isAuthenticated(): boolean {
    return TokenManager.getToken() !== null
  },

  getCurrentUser(): Profile | null {
    return TokenManager.getUserData()
  }
}

// Vendor API functions
export const vendorApi = {
  async getAllVendors(): Promise<Vendor[]> {
    return apiCall<Vendor[]>('/vendors')
  },

  async getVendorById(id: number): Promise<Vendor> {
    return apiCall<Vendor>(`/vendors/${id}`)
  },

  async getVendorByEmail(email: string): Promise<Vendor> {
    return apiCall<Vendor>(`/vendors/email/${encodeURIComponent(email)}`)
  },

  async updateVendor(id: number, data: Vendor, token?: string): Promise<Vendor> {
    const authToken = token || TokenManager.getToken()
    if (!authToken) {
      throw new ApiError(401, 'No authentication token found')
    }
    
    return apiCall<Vendor>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, authToken)
  },

  async createVendor(data: Omit<Vendor, 'id'>, token?: string): Promise<Vendor> {
    const authToken = token || TokenManager.getToken()
    if (!authToken) {
      throw new ApiError(401, 'No authentication token found')
    }
    
    // Since there's no POST endpoint for vendors in the API spec,
    // we'll use PUT with id 0 or create a vendor through profile update
    const vendorData: Vendor = {
      id: 0,
      ...data
    }
    
    return this.updateVendor(0, vendorData, authToken)
  }
}
