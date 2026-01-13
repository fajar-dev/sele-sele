import axios from 'axios'
import type { AxiosInstance } from 'axios'

export class ApiService {
  public get client(): AxiosInstance {
    const config = useRuntimeConfig()
    
    return axios.create({
      baseURL: config.public.apiUrl as string,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
  }
}

export const apiService = new ApiService()