<template>
  <UHeader
    :toggle="false"
    :ui="{
      container: 'sm:px-14!',
      right: 'justify-end-safe overflow-x-auto py-2'
    }"
  >
    <template #left>
      <NuxtLink to="/">
        <img class="h-10" src="/logo.png" alt="Logo" />
      </NuxtLink>
      <slot name="left" />
    </template>

    <template #right>
      <slot name="right" />

      <div
        role="group"
        class="flex items-center gap-0.5"
      >

        <UColorModeButton size="sm" />
        <ClientOnly>
          <UDropdownMenu
            :items="items"
            size="sm"
            :content="{
              align: 'start',
              side: 'bottom',
              sideOffset: 8
            }"
            :ui="{
              content: 'w-48'
            }"
          >
            <div v-if="isLoading" class="flex items-center gap-2 pl-2">
              <USkeleton class="h-8 w-8 rounded-full" />
              <div class="space-y-1">
                <USkeleton class="h-4 w-20" />
                <USkeleton class="h-3 w-24" />
              </div>
            </div>
            <UUser
              v-else
              size="sm"
              :name="authState.user?.name || 'User'"
              :description="authState.user?.email || ''"
              class="pl-2"
              :avatar="{
                src: authState.user?.avatar,
              }"
            />
          </UDropdownMenu>
        </ClientOnly>
      </div>
    </template>
  </UHeader>
  <UDashboardToolbar 
    v-if="toolbar"
    :ui="{
      left: 'xl:ps-52',
      right: 'xl:pe-52'
    }"
  >
    <template #left>
       <slot name="toolbar-left" />
    </template>
    <template #right>
       <slot name="toolbar-right" />
    </template>
  </UDashboardToolbar>
</template>

<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui'
  import { useAuth } from '~/composables/useAuth'

  const { state: authState, service: authService } = useAuth()
  const toast = useToast()

  const isLoading = computed(() => !!authState.token && !authState.user)

  const handleLogout = async () => {
    await authService.logout()
    toast.add({ title: 'Logged out successfully' })
    navigateTo('/sign-in')
  }

  const items = computed<DropdownMenuItem[]>(() => [
    {
      label: 'Sign Out',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout
    },
  ])

const toolbar = defineModel<boolean>('toolbar', {
  type: Boolean,
  default: false
})
</script>