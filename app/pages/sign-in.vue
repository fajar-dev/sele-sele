
<template>
    <div class="h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <!-- Background blur circles -->
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-black/20 dark:bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-black/20 dark:bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;" />
        
        <UContainer class="max-w-md relative z-10">
            <div
                class="p-5"
            >
                <div class="space-y-6 text-center">
                    <div class="flex justify-center mb-4">
                        <img
                            src="/logo.png"
                            alt="Sele-Sele Logo"
                            class="h-16 w-auto object-contain transition-transform hover:scale-110 duration-300"
                        />
                    </div>
                    
                    <div class="space-y-2">
                        <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            SELE SELE
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">
                            Note pages editor like Notion
                        </p>
                    </div>
                    
                    <UButton
                        variant="soft"
                        size="lg"
                        color="neutral"
                        class="w-full justify-center group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                        :loading="googleLoading"
                        @click="handleGoogleLogin"
                    >
                        <template v-if="!googleLoading" #leading>
                            <Icon name="logos:google-icon" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        </template>
                        <span class="font-medium">
                            {{ googleLoading ? 'Signing in...' : 'Continue with Google' }}
                        </span>
                    </UButton>
                    
                    <!-- Footer -->
                    <div class="pt-4">
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            By continuing, you agree to our 
                            <a href="#" class="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                Terms of Service
                            </a> 
                            and 
                            <a href="#" class="underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
const googleLoading = ref(false)
const toast = useToast()
import { authService } from "~/services/authService"

const user = authService.user

const userDropdownItems = computed(() => [
  [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    onSelect: () => {
      authService.logout()
      toast.add({ title: 'Logged out successfully' })
    }
  }]
])

const handleOnSuccess = async (response: any) => {
  try {
    const result = await authService.googleLogin(response.code);
    toast.add({ title: 'Login Successful', color: 'primary' })
    navigateTo('/')
  } catch (error) {
    toast.add({ title: 'Authentication failed', color: 'error' })
  } finally {
    googleLoading.value = false
  }
};

const handleOnError = (errorResponse: any) => {
  googleLoading.value = false
  toast.add({ title: 'Google Sign-In Error', color: 'error' })
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});

const handleGoogleLogin = () => {
  if (!isReady.value) return
  googleLoading.value = true
  login()
}

</script>