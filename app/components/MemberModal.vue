<template>
    <UModal
        v-model:open="open"
        title="Collaboration"
        description="Manage collaborators"
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
            </UForm>

            <UPageCard class="mt-5" variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
                <template #header>
                    <UInput
                        v-model="q"
                        icon="i-lucide-search"
                        placeholder="Search members"
                        autofocus
                        class="w-full"
                    />
                </template>

                <ul role="list" class="divide-y divide-default">
                    <li
                        v-for="(member, index) in filteredMembers"
                        :key="index"
                        class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
                    >
                        <div class="flex items-center gap-3 min-w-0">
                            <UAvatar
                                v-bind="member.avatar"
                                size="md"
                            />

                            <div class="text-sm min-w-0">
                                <p class="text-highlighted font-medium truncate">
                                    {{ member.name }}
                                </p>
                                <p class="text-muted truncate">
                                    {{ member.username }}
                                </p>
                            </div>
                        </div>

                        <UDropdownMenu :items="items" :content="{ align: 'end' }">
                            <UButton
                                icon="i-lucide-ellipsis-vertical"
                                color="neutral"
                                variant="ghost"
                            />
                        </UDropdownMenu>
                    </li>
                </ul>
            </UPageCard>

            <div class="flex justify-end gap-2 mt-4">
                <UButton
                    label="Close"
                    color="neutral"
                    variant="subtle"
                    @click="open = false"
                />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = defineModel<boolean>("open", { default: false })
const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

const q = ref('')

const members = ref([
    {
        name: 'John Doe',
        username: 'john@example.com',
        avatar: { src: 'https://i.pravatar.cc/150?img=1' }
    },
    {
        name: 'Jane Smith',
        username: 'jane@example.com',
        avatar: { src: 'https://i.pravatar.cc/150?img=5' }
    },
    {
        name: 'Bob Wilson',
        username: 'bob@example.com',
        avatar: { src: 'https://i.pravatar.cc/150?img=12' }
    }
])

const filteredMembers = computed(() => {
    if (!q.value) return members.value
    return members.value.filter(m => 
        m.name.toLowerCase().includes(q.value.toLowerCase()) ||
        m.username.toLowerCase().includes(q.value.toLowerCase())
    )
})

const items = [
    [{
        label: 'Remove',
        icon: 'i-lucide-trash'
    }]
]

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