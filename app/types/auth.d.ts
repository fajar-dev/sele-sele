export interface User {
    id: number
    name: string
    email: string
    picture?: string
    avatar?: string
}

export interface AuthData {
    user: User
    token: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data: AuthData
}