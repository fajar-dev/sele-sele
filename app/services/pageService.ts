import type { CreatePageParams, GetPageParams, PageResponse, SinglePageResponse, UpdatePageParams, Member } from "~/types/page"
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

    async updateContent(id: string, content: string): Promise<void> {
        try {
            await apiService.client.post(`/pages/${id}/content`, { content }, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
        } catch (error: any) {
            throw new Error(`Failed to update content: ${error.message}`)
        }
    }

    async getContent(id: string): Promise<{ success: boolean; data: { content: string } }> {
        try {
            const response = await apiService.client.get(`/pages/${id}/content`, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to get page content: ${error.message}`)
        }
    }

    async downloadMd(id: string): Promise<Blob> {
        try {
            const response = await apiService.client.get(`/pages/${id}/md`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                },
                responseType: 'blob'
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to download markdown: ${error.message}`)
        }
    }

    async downloadPdf(id: string): Promise<Blob> {
        try {
            const response = await apiService.client.get(`/pages/${id}/pdf`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                },
                responseType: 'blob'
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to download PDF: ${error.message}`)
        }
    }

    async getMembers(id: string): Promise<{ success: boolean; data: Member[] }> {
        try {
            const response = await apiService.client.get(`/pages/${id}/member`, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
            return response.data
        } catch (error: any) {
            throw new Error(`Failed to get members: ${error.message}`)
        }
    }

    async addMember(id: string, email: string): Promise<void> {
        try {
            await apiService.client.put(`/pages/${id}/member`, { email }, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            }
            })
        } catch (error: any) {
            throw new Error(`Failed to add member: ${error.message}`)
        }
    }

    async removeMember(id: string, email: string): Promise<void> {
        try {
            await apiService.client.delete(`/pages/${id}/member`, {
            headers: {
                authorization: `Bearer ${useAuth().state.token}`
            },
            data: { email }
            })
        } catch (error: any) {
            throw new Error(`Failed to remove member: ${error.message}`)
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
    async getPermission(id: string): Promise<{ success: boolean; data: { isOwner: boolean } }> {
        try {
            const response = await apiService.client.get(`/pages/${id}/permission`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
             throw new Error(`Failed to get page permission: ${error.message}`)
        }
    }
}

export const pageService = new PageService()