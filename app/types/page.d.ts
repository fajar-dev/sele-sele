export interface PageItem {
  id: number
  title: string
  description: string
  image: string
}

export interface GetPageParams {
  page?: number
  limit?: number
  owner?: boolean
}

export interface PageResponse {
  success: boolean
  message: string
  data: PageItem[]
}

export interface SinglePageResponse {
  success: boolean
  message: string
  data: PageItem
}

export interface CreatePageParams {
  title: string
  description: string
  icon: string
}