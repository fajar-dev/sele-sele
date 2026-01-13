export interface PageItem {
  id: number
  title: string
  description: string
  icon: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  members?: member[]
}

export interface member {
  email: string
  avatar: string
  isOwner: boolean
  isPending: boolean
}

export interface GetPageParams {
  page?: number
  limit?: number
  owned?: boolean
}

export interface PageResponse {
  success: boolean
  message: string
  data: PageItem[]
  meta: {
    pagination: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  }
}

export interface SinglePageResponse {
  success: boolean
  message: string
  data: PageItem
}

export interface CreatePageParams {
  title: string
  description: string | null
  icon: string
}

export interface UpdatePageParams {
  title: string
  description: string | null
  icon: string
}