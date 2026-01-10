<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const loading = ref(false)
const googleLoading = ref(false)

definePageMeta({
  layout: 'auth',
  auth: false
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const fields = [
  { name: 'email', type: 'text' as const, label: 'Email', placeholder: 'Enter your email', required: true },
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'Enter your password', required: true },
  { name: 'remember', type: 'checkbox' as const, label: 'Remember me' }
]

const schema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required').min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  
  loading.value = false
}

function handleGoogleLogin() {
  googleLoading.value = true
}
</script>

<template>
    <div class="h-screen flex items-center justify-center px-4">
        <UPageCard
            variant="subtle"
            class="max-w-sm w-full bg-elevated/5"
        >
        <div class="flex flex-col items-center">
            <div class="flex flex-col items-center">
                <img
                    src="https://mdn.nusa.net.id/wp-content/uploads/sites/2/2024/08/Nusanet-Logo-with-Subtitle-e1724455147320.png"
                    alt="Company Logo"
                    class="h-10 object-contain mb-8"
                >
            </div>

            <div class="w-full max-w-sm space-y-4">
            <!-- Auth Form -->
                <UAuthForm
                    :fields="fields"
                    :schema="schema"
                    :loading="loading"
                    class="w-full"
                    @submit="onSubmit"
                />

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300" />
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="text-gray-500 bg-muted px-2"> OR </span>
                </div>
            </div>

            <UButton
                variant="outline"
                size="lg"
                color="neutral"
                class="w-full justify-center"
                :loading="googleLoading"
                @click="handleGoogleLogin"
            >
                <template v-if="!googleLoading" #leading>
                    <Icon name="logos:google-icon" class="w-5 h-5" />
                </template>
                {{ googleLoading ? 'Signing in...' : 'Continue with Google' }}
            </UButton>
            </div>
        </div>
        </UPageCard>
    </div>
    
</template>