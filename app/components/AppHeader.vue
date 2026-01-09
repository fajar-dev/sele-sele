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

      <USeparator
        orientation="vertical"
        class="h-7"
      />

      <div
        role="group"
        class="flex items-center gap-0.5"
      >

        <UColorModeButton size="sm" />

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
          <UUser
            size="sm"
            name="Fajar Rivaldi Chan"
            description="fajarchan@nusa.net.id"
            class="pl-2"
            :avatar="{
              src: 'https://i.pravatar.cc/150?u=john-doe',
              icon: 'i-lucide-image'
            }"
          />
        </UDropdownMenu>
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui'

  const items = ref<DropdownMenuItem[]>([
    {
      label: 'Sign Out',
      icon: 'i-lucide-log-out'
    },
  ])
</script>