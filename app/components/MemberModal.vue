<template>
    <UModal
        v-model:open="open"
        title="Collaboration"
        description="Manage collaborators"
    >
        <template #body>
            <UForm
                class="space-y-4"
                :schema="schema"
                :state="state"
                @submit="onSubmit"
            >
                <UFormField label="Invite Friends" name="emails">
                    <div class="flex gap-2">
                        <UInputTags 
                            v-model="state.emails"
                            class="flex-1"
                            placeholder="Enter email addresses..."
                        />
                        <UButton
                            label="Invite"
                            color="neutral"
                            variant="solid"
                            type="submit"
                            class="shrink-0"
                        />
                    </div>
                </UFormField>

                <div class="flex justify-end gap-2">
                    <UButton
                        label="Close"
                        color="neutral"
                        variant="subtle"
                        @click="open = false"
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

const schema = z.object({
  emails: z.array(z.string().email("Invalid email")).min(1, "At least one email is required")
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  emails: []
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ 
    title: 'Success', 
    description: `Invited ${event.data.emails.length} collaborator(s)`, 
    color: 'neutral', 
    progress: false
  })
  console.log('Emails submitted:', event.data.emails)
  open.value = false
  state.emails = []
}
</script>