<template>
    <UModal
        v-model:open="open"
        title="Create Page"
        description="Create a new page"
    >
        <template #body>
        <Placeholder class="h-48" />
        </template>
    </UModal>
</template>

<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false })
</script>
