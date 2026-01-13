import type { CreatePageParams, GetPageParams, PageItem, PageResponse, SinglePageResponse } from "~/types/page"
import { apiService } from "./apiService"

export class PageService {

    async create(data: CreatePageParams): Promise<SinglePageResponse> {
        try {
            const response = await apiService.client.post('/create', {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            },
            data
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to create page: ${error.message}`)
        }
    }

    async get(params?: GetPageParams): Promise<PageResponse> {
        try {
            const response = await apiService.client.get('/get', {
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
}

export const pageService = new PageService()