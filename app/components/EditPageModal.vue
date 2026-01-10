<template>
    <UModal
        v-model:open="open"
        title="Create Page"
        description="Create a new page"
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
                        label="Save"
                        color="neutral"
                        variant="solid"
                        type="submit"
                    />
                </div>
            </UForm>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = defineModel<boolean>("open", { default: false })
const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')
const selectedEmoji = ref('📖')

const onSelectEmoji = (emoji: any) => {
  selectedEmoji.value = emoji.i
}

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(3, "Description must be at least 3 characters long"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: '',
  description: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'neutral', progress: false})
  console.log(event.data)
  open.value = false
  state.title = ''
  state.description = ''
  console.log(selectedEmoji.value)
  selectedEmoji.value = '📖'
}
</script>

