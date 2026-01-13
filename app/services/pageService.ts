import type { CreatePageParams, GetPageParams, PageResponse, SinglePageResponse, UpdatePageParams } from "~/types/page"
import { apiService } from "./apiService"

export class PageService {

    async create(data: CreatePageParams): Promise<SinglePageResponse> {
        try {
            const response = await apiService.client.post('/pages', data, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to create page: ${error.message}`)
        }
    }

    async show(id: string): Promise<SinglePageResponse> {
        try {
            const response = await apiService.client.get(`/pages/${id}`, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to show page: ${error.message}`)
        }
    }

    async get(params?: GetPageParams): Promise<PageResponse> {
        try {
            const response = await apiService.client.get('/pages', {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            },
            params
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to get pages: ${error.message}`)
        }
    }

    async update(id: string, data: UpdatePageParams): Promise<SinglePageResponse> {
        try {
            const response = await apiService.client.put(`/pages/${id}`, data, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to update page: ${error.message}`)
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await apiService.client.delete(`/pages/${id}`, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
        } catch (error: any) {
            throw new Error(`Failed to delete page: ${error.message}`)
        }
    }
}

export const pageService = new PageService()