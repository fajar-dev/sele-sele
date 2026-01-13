import { apiService } from "./apiService"
import type { AuthResponse, User } from "../types/auth"

export class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'auth_user'

  public user = ref<User | null>(null)
  public token = ref<string | null>(null)

  constructor() {
    this.initSession()
  }

  private async initSession() {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem(this.TOKEN_KEY)
    
    if (token) {
      try {
        this.token.value = token
        const response = await apiService.client.get<{ success: boolean, data: User }>('/auth/me')
        this.user.value = response.data.data
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.user.value))
      } catch (error) {
        this.logout()
      }
    }
  }

  async googleLogin(code: string): Promise<AuthResponse> {
    try {
      const response = await apiService.client.post<AuthResponse>('/auth/login', { code })
      this.setSession(response.data)
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to login with Google: ${error.message}`)
    }
  }

  async logout() {
    if (typeof window === 'undefined') return

    try {
      if (this.token.value) {
        await apiService.client.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)

      this.token.value = null
      this.user.value = null
    }
  }

  private setSession(response: AuthResponse) {
    if (typeof window === 'undefined') return

    const { user, token } = response.data

    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))

    this.token.value = token
    this.user.value = user
  }
}

export const authService = new AuthService()