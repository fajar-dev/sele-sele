<script setup lang="ts">
import type { CollaborationUser } from '~/composables/useEditorCollaboration'
import MemberModal from '~/components/MemberModal.vue'

defineProps<{
  users: CollaborationUser[]
  pageId: string
}>()

const addOpen = ref(false)

</script>

<template>
  <template v-if="users.length > 0">
    <UAvatarGroup>
      <template
        v-for="user in users"
        :key="user.name"
      >
        <UTooltip :text="user.name">
          <UAvatar
            :alt="user.name"
            :src="user.avatar"
            size="sm"
            :style="{
              color: user.color
            }"
          />
        </UTooltip>
      </template>
    </UAvatarGroup>

    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-user-plus"
      @click="addOpen = true"
      size="sm"
    />
    <MemberModal v-model:open="addOpen" :page-id="pageId" />

    <USeparator
      orientation="vertical"
      class="h-7"
    />
  </template>
</template>
