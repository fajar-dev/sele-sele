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
                v-if="isOwner"
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
                            :loading="asking"
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

                <div class="max-h-60 overflow-y-auto">
                    <ul role="list" class="divide-y divide-default">
                        <template v-if="loading">
                            <li v-for="i in 3" :key="i" class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6">
                                <div class="flex items-center gap-3 min-w-0 w-full">
                                    <USkeleton class="h-10 w-10 rounded-full shrink-0" />
                                    <div class="space-y-2 w-full">
                                        <USkeleton class="h-4 w-1/3" />
                                        <USkeleton class="h-3 w-1/2" />
                                    </div>
                                </div>
                            </li>
                        </template>
                        <template v-else>
                        <li
                            v-for="(member, index) in filteredMembers"
                            :key="index"
                            class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
                        >
                            <div class="flex items-center gap-3 min-w-0">
                                <UAvatar
                                    :src="member.avatar"
                                    :alt="member.email"
                                    size="md"
                                />

                                <div class="text-sm min-w-0">
                                    <p class="text-highlighted font-medium truncate">
                                        {{ member.name }}
                                    </p>
                                    <p class="truncate text-xs text-muted-foreground">
                                        {{ member.email }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <div class="flex gap-2">
                                    <UBadge v-if="member.isPending" color="warning" variant="subtle" size="xs">Pending</UBadge>
                                </div>
                                <UDropdownMenu 
                                    v-if="!member.isOwner && isOwner" 
                                    :items="getMemberItems(member)" 
                                    :content="{ align: 'end' }"
                                >
                                    <UButton
                                        icon="i-lucide-ellipsis-vertical"
                                        color="neutral"
                                        variant="ghost"
                                    />
                                </UDropdownMenu>
                            </div>
                        </li>
                        </template>
                    </ul>
                </div>
            </UPageCard>

            <div class="flex justify-end gap-2 mt-4">
                <UButton
                    label="Close"
                    color="neutral"
                    variant="subtle"
                    @click="open = false"
                />
            </div>
            
            <DeleteConfirmModal
                v-model:open="deleteOpen"
                :title="`Remove ${memberToDelete}?`"
                description="Are you sure you want to remove this member? They will lose access to this page."
                confirm-label="Remove"
                :on-confirm="onConfirmRemove"
            />
        </template>
    </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { pageService } from '~/services/pageService'
import type { Member } from '~/types/page'

const props = defineProps<{
    pageId: string
}>()

const open = defineModel<boolean>("open", { default: false })
const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

const q = ref('')
const loading = ref(false)
const asking = ref(false) // Loading state for inviting
const members = ref<Member[]>([])
const toast = useToast()

const isOwner = ref(false)

const loadMembers = async () => {
    if (!props.pageId) return
    loading.value = true
    try {
        const res = await pageService.getMembers(props.pageId)
        members.value = res.data

        const permRes = await pageService.getPermission(props.pageId)
        isOwner.value = permRes.data.isOwner
    } catch (e: any) {
        toast.add({ title: 'Error loading members', description: e.message, color: 'error' })
    } finally {
        loading.value = false
    }
}

// Load members when modal opens
watch(open, (isOpen) => {
    if (isOpen) {
        loadMembers()
    }
})

const filteredMembers = computed(() => {
    if (!q.value) return members.value
    return members.value.filter(m => 
        m.email.toLowerCase().includes(q.value.toLowerCase())
    )
})

const getMemberItems = (member: Member) => [
   [{
        label: 'Remove',
        icon: 'i-lucide-trash',
        onSelect: () => removeMember(member.email)
    }]
]

const deleteOpen = ref(false)
const memberToDelete = ref<string | null>(null)

const removeMember = (email: string) => {
    memberToDelete.value = email
    deleteOpen.value = true
}

const onConfirmRemove = async () => {
    if (!memberToDelete.value) return
    try {
        await pageService.removeMember(props.pageId, memberToDelete.value)
        toast.add({ title: 'Member removed successfully' })
        deleteOpen.value = false
        memberToDelete.value = null
        await loadMembers()
    } catch (e: any) {
        toast.add({ title: 'Error removing member', description: e.message, color: 'error' })
    }
}

const schema = z.object({
    emails: z.array(z.string().email("Invalid email")).min(1, "At least one email is required")
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    emails: []
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    asking.value = true
    try {
        // Invite all emails
        for (const email of event.data.emails) {
            await pageService.addMember(props.pageId, email)
        }

        toast.add({ 
            title: 'Success', 
            description: `Invited ${event.data.emails.length} collaborator(s)`, 
            color: 'neutral', 
        })
        
        state.emails = []
        await loadMembers()
    } catch (e: any) {
         toast.add({ title: 'Error adding members', description: e.message, color: 'error' })
    } finally {
        asking.value = false
    }
}
</script>