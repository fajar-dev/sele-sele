<template>
    <UModal
        v-model:open="open"
        title="Create Page"
        description="Create a new page"
        :ui="{
            overlay: 'backdrop-blur-[4px] bg-gray-950/10 dark:bg-gray-950/25'
        }"
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
                            <UButton 
                                :label="selectedEmoji" 
                                color="neutral" 
                                size="xl" 
                                variant="outline" 
                                class="text-4xl" 
                            />
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
                        label="Save"
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

const open = defineModel<boolean>("open", { default: false })
const emit = defineEmits(['success'])
const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')
const selectedEmoji = ref('📖')
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
  title: '',
  description: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const res = await pageService.create({
      title: event.data.title,
      description: event.data.description ?? null,
      icon: selectedEmoji.value
    })
    
    toast.add({ 
        title: 'Page created successfully.', 
        color: 'neutral', 
    })
    
    emit('success')
    open.value = false
    state.title = ''
    state.description = ''
    selectedEmoji.value = '📖'
    navigateTo('/page/' + res.data.id)
  } catch (error: any) {
    toast.add({
        title: 'Error',
        description: error.message,
        color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>