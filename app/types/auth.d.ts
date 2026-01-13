export interface User {
    id: number
    name: string
    email: string
    avatar?: string
}

export interface AuthData {
    user: User
    accessToken: string
    refreshToken: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data: AuthData
}