// API configuration and authentication functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

// Authentication API calls
export const authAPI = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Signup failed')
    }

    return response.json()
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token')
    
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth_token')
    
    if (!token) return null

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

      if (!response.ok) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        return null
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching current user:', error)
      return null
    }
  }
}

// Journal entries API calls
export const journalAPI = {
  async getEntries(): Promise<any[]> {
    const token = localStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}/journal/entries`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch entries')
    }

    return response.json()
  },

  async createEntry(entry: any): Promise<any> {
    const token = localStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}/journal/entries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      throw new Error('Failed to create entry')
    }

    return response.json()
  },

  async updateEntry(id: string, entry: any): Promise<any> {
    const token = localStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}/journal/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      throw new Error('Failed to update entry')
    }

    return response.json()
  },

  async deleteEntry(id: string): Promise<void> {
    const token = localStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}/journal/entries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete entry')
    }
  }
}

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token)
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
