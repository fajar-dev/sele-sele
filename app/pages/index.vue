<template>
    <AppHeader>
        <template #right>
            <ClientOnly>
                <UButton size="sm" color="neutral" icon="i-lucide-plus" @click="addOpen = true">
                    New Page
                </UButton>
                <AddPageModal v-model:open="addOpen" @success="onPageCreated" />
            </ClientOnly>
        </template>
    </AppHeader>

    <UContainer>
        <div class="space-y-8 py-8">
            <UPageHeader
                :title="`Hello, ${authState.user?.name ?? ''} !!`"
                description="Good Morning, Have a nice day"
            />

            <!-- My Page Section -->
            <div class="space-y-6">
                <div class="space-y-1">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                        My Page
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Your personal collection of pages
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <template v-if="myLoading && myPages.length === 0">
                        <UCard v-for="i in 6" :key="i">
                            <div class="space-y-2">
                                <USkeleton class="h-10 w-10 text-4xl" :ui="{ rounded: 'rounded-none' }" /> 
                                <USkeleton class="h-6 w-3/4" />
                                <USkeleton class="h-4 w-full" />
                                <USkeleton class="h-4 w-2/3" />
                                <div class="flex -space-x-2">
                                    <USkeleton class="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                    <USkeleton class="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                </div>
                            </div>
                        </UCard>
                    </template>
                    <template v-else>
                        <UPageCard
                            v-for="page in myPages"
                            :key="page.id"
                            :title="page.title"
                            :description="page.description"
                            spotlight
                            spotlight-color="primary"
                            :to="`/${page.id}`"
                        >
                        <template #header>
                            <span class="text-4xl">
                                {{ page.icon }}
                            </span>
                        </template>
                        <template #footer>
                                <div class="flex flex-col gap-2">
                                <UAvatarGroup size="sm" :max="5">
                                    <UAvatar 
                                        v-for="member in page.members" 
                                        :key="member.email" 
                                        :alt="member.email"
                                        :src="member.avatar"
                                    />
                                </UAvatarGroup>     
                                <small>Updated {{ getRelativeTime(page.updatedAt) }}</small>
                                </div>      
                            </template>
                        </UPageCard>
                    </template>
                    <div v-if="myPages.length === 0 && !myLoading" class="col-span-full flex flex-col items-center justify-center text-center py-8 text-gray-400 dark:text-gray-400">
                        <UIcon name="i-lucide-file" size="56" />
                        <span class="pt-3">You haven't created any pages yet.</span>
                    </div>
                </div>
                <div class="flex justify-center" v-if="myPages.length < myPageParams.total">
                    <UButton 
                        size="sm" 
                        variant="soft" 
                        color="neutral" 
                        icon="i-lucide-arrow-down"
                        :loading="myLoading"
                        @click="loadMyPages(false)"
                    >
                        Load More
                    </UButton>
                </div>
            </div>

            <!-- My Page Section -->
            <div class="space-y-6">
                <div class="space-y-1">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                        Collaboration
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        collaborate pages with me
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <template v-if="collabLoading && collabPages.length === 0">
                        <UCard v-for="i in 6" :key="i">
                            <div class="space-y-2">
                                <USkeleton class="h-10 w-10 text-4xl" :ui="{ rounded: 'rounded-none' }" /> 
                                <USkeleton class="h-6 w-3/4" />
                                <USkeleton class="h-4 w-full" />
                                <USkeleton class="h-4 w-2/3" />
                                <div class="flex -space-x-2">
                                    <USkeleton class="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                    <USkeleton class="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                </div>
                            </div>
                        </UCard>
                    </template>
                    <template v-else>
                        <UPageCard
                            v-for="page in collabPages"
                            :key="page.id"
                            :title="page.title"
                            :description="page.description"
                            spotlight
                            spotlight-color="primary"
                            :to="`/${page.id}`"
                        >
                            <template #header>
                                <span class="text-4xl">
                                    {{ page.icon }}
                                </span>
                            </template>
                            <template #footer>
                                <div class="flex flex-col gap-2">
                                <UAvatarGroup size="sm" :max="5">
                                    <UAvatar 
                                        v-for="member in page.members" 
                                        :key="member.email" 
                                        :alt="member.email"
                                        :src="member.avatar"
                                    />
                                </UAvatarGroup>     
                                <small>Updated {{ getRelativeTime(page.updatedAt) }}</small>
                                </div>      
                            </template>
                        </UPageCard>
                    </template>
                    <div v-if="collabPages.length === 0 && !collabLoading" class="col-span-full flex flex-col items-center justify-center text-center py-8 text-gray-400 dark:text-gray-400">
                        <UIcon name="i-lucide-file" size="56" />
                        <span class="pt-3">No pages shared with you yet.</span>
                    </div>
                </div>
                <div class="flex justify-center" v-if="collabPages.length < collabPageParams.total">
                    <UButton 
                        size="sm" 
                        variant="soft" 
                        color="neutral" 
                        icon="i-lucide-arrow-down"
                        :loading="collabLoading"
                        @click="loadCollabPages(false)"
                    >
                        Load More
                    </UButton>
                </div>
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { pageService } from '~/services/pageService'
import type { PageItem } from '~/types/page'

const { state: authState } = useAuth()
const addOpen = ref(false)
const toast = useToast()

const myPages = ref<PageItem[]>([])
const collabPages = ref<PageItem[]>([])
const myPageParams = reactive({ page: 1, limit: 6, total: 0 })
const collabPageParams = reactive({ page: 1, limit: 6, total: 0 })
const myLoading = ref(false)
const collabLoading = ref(false)

const loadMyPages = async (reset = false) => {
  if (myLoading.value) return
  if (reset) {
    myPages.value = []
    myPageParams.page = 1
    myPageParams.total = 0
  }

  myLoading.value = true
  try {
    const res = await pageService.get({ 
      page: myPageParams.page, 
      limit: myPageParams.limit, 
      owned: true 
    })

    myPageParams.total = res.meta.pagination.totalItems
    
    myPages.value.push(...res.data)
    myPageParams.page++
  } catch (e: any) {
    toast.add({ title: 'Error loading pages', description: e.message, color: 'error' })
  } finally {
    myLoading.value = false
  }
}

const loadCollabPages = async (reset = false) => {
  if (collabLoading.value) return
  if (reset) {
    collabPages.value = []
    collabPageParams.page = 1
    collabPageParams.total = 0
  }

  collabLoading.value = true
  try {
    const res = await pageService.get({ 
      page: collabPageParams.page, 
      limit: collabPageParams.limit, 
      owned: false 
    })
    
    collabPageParams.total = res.meta.pagination.totalItems
    
    collabPages.value.push(...res.data)
    collabPageParams.page++
  } catch (e: any) {
    toast.add({ title: 'Error loading collaboration pages', description: e.message, color: 'error' })
  } finally {
    collabLoading.value = false
  }
}

const onPageCreated = () => {
    loadMyPages(true)
}

onMounted(() => {
  loadMyPages()
  loadCollabPages()
})

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString()
}

</script>