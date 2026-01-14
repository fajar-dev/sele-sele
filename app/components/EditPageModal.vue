<template>
    <UModal
        v-model:open="open"
        title="Edit Page"
        description="Update page information"
    >
        <template #body>
            <UForm
                class="space-y-4"
                :schema="schema"
                :state="state"
                @submit="onSubmit"
            >
            <div class="flex flex-col gap-4">
                <div class="flex gap-4 w-full">
                    <UPopover>
                        <UButton :label="selectedEmoji" color="neutral" size="xl" variant="outline" class="text-4xl" />
                        <template #content>
                            <NuxtEmojiPicker
                                :hide-search="false"
                                :theme="theme"
                                @select="onSelectEmoji"
                            />
                        </template>
                    </UPopover>
                    
                    <UFormField label="Title" name="title" required class="w-full">
                        <UInput
                        v-model="state.title"
                        placeholder="Title"
                        class="w-full"
                        />
                    </UFormField>
                </div>
            </div>

                <UFormField label="Description" name="description">
                    <UTextarea
                        v-model="state.description"
                        placeholder="Type a description..."
                        class="w-full"
                    />
                </UFormField>

                <div class="flex justify-end gap-2">
                    <UButton
                        label="Cancel"
                        color="neutral"
                        variant="subtle"
                        @click="open = false"
                    />
                    <UButton
                        label="Save Changes"
                        color="neutral"
                        variant="solid"
                        type="submit"
                        :loading="loading"
                    />
                </div>
            </UForm>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { pageService } from '~/services/pageService'
import type { PageItem } from '~/types/page'

const props = defineProps<{
    page: PageItem
}>()

const emit = defineEmits(['success'])
const open = defineModel<boolean>("open", { default: false })
const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')
const selectedEmoji = ref(props.page.icon || '📖')
const loading = ref(false)

const onSelectEmoji = (emoji: any) => {
  selectedEmoji.value = emoji.i
}

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: props.page.title,
  description: props.page.description
})

// Update state when page prop changes
watch(() => props.page, (newPage) => {
    state.title = newPage.title
    state.description = newPage.description
    selectedEmoji.value = newPage.icon
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await pageService.update(props.page.id.toString(), {
        title: event.data.title,
        description: event.data.description ?? null,
        icon: selectedEmoji.value
    })
    
    toast.add({ 
        title: 'Page updated successfully.', 
        color: 'neutral', 
    })
    
    emit('success')
    open.value = false
  } catch (e: any) {
    toast.add({ title: 'Error updating page', description: e.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
