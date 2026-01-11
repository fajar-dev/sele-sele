<template>
    <AppHeader>
        <template #right>
            <UButton size="sm" color="neutral" icon="i-lucide-plus" @click="addOpen = true">
                New Page
            </UButton>
            <AddPageModal v-model:open="addOpen" />
        </template>
    </AppHeader>

    <UContainer>
        <div class="space-y-8 py-8">
            <UPageHeader
                title="Hello, Fajar Rivaldi Chan !!"
                description="Good Morning, Have a nice day"
            />

            <!-- My Page Section -->
            <div class="space-y-6">
                <div class="space-y-1">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                        My Page
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Your personal collection of pages
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <UPageCard
                        title="Tailwind CSS"
                        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
                        spotlight
                        spotlight-color="primary"
                        to="/019bac87-026d-7ffa-912b-d867c2aa7926"
                    >
                    <template #header>
                        <span class="text-4xl">
                            😃
                        </span>
                    </template>
                    <template #footer>
                            <div class="flex flex-col gap-2">
                            <UAvatarGroup size="sm" :max="5">
                                <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
                            </UAvatarGroup>     
                            <small>Updated 2 days ago</small> 
                            </div>      
                        </template>
                    </UPageCard>
                    <UPageCard
                        title="Tailwind CSS"
                        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
                        spotlight
                        spotlight-color="primary"
                        to="/019bac87-026d-7ffa-912b-d867c2aa7926"
                    >
                        <template #header>
                            <span class="text-4xl">
                                😃
                            </span>
                        </template>
                        <template #footer>
                            <div class="flex flex-col gap-2">
                            <UAvatarGroup size="sm" :max="5">
                                <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
                                <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                            </UAvatarGroup>     
                            <small>Updated 2 days ago</small> 
                            </div>      
                        </template>
                    </UPageCard>
                    <UPageCard
                        title="Tailwind CSS"
                        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
                        spotlight
                        spotlight-color="primary"
                        to="/019bac87-026d-7ffa-912b-d867c2aa7926"
                    >
                        <template #header>
                            <span class="text-4xl">
                                😃
                            </span>
                        </template>
                        <template #footer>
                            <div class="flex flex-col gap-2">
                            <UAvatarGroup size="sm" :max="5">
                                <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
                                <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                            </UAvatarGroup>     
                            <small>Updated 2 days ago</small> 
                            </div>      
                        </template>
                    </UPageCard>
                </div>
                <div class="flex justify-center">
                    <UButton size="sm" variant="soft" color="neutral" icon="i-lucide-arrow-down">
                        Load More
                    </UButton>
                </div>
            </div>

            <!-- My Page Section -->
            <div class="space-y-6">
                <div class="space-y-1">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                        Collaboration
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        collaborate pages with me
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <UPageCard
                        title="Tailwind CSS"
                        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
                        spotlight
                        spotlight-color="primary"
                        to="/019bac87-026d-7ffa-912b-d867c2aa7926"
                    >
                        <template #header>
                            <span class="text-4xl">
                                😃
                            </span>
                        </template>
                        <template #footer>
                            <div class="flex flex-col gap-2">
                            <UAvatarGroup size="sm" :max="5">
                                <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
                                <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                            </UAvatarGroup>     
                            <small>Updated 2 days ago</small> 
                            </div>      
                        </template>
                    </UPageCard>
                    <UPageCard
                        title="Tailwind CSS"
                        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
                        spotlight
                        spotlight-color="primary"
                        to="/019bac87-026d-7ffa-912b-d867c2aa7926"
                    >
                        <template #header>
                            <span class="text-4xl">
                                😃
                            </span>
                        </template>
                        <template #footer>
                            <div class="flex flex-col gap-2">
                            <UAvatarGroup size="sm" :max="5">
                                <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
                                <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                            </UAvatarGroup>     
                            <small>Updated 2 days ago</small> 
                            </div>      
                        </template>
                    </UPageCard>
                    <UPageCard
                        title="Tailwind CSS"
                        description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements."
                        spotlight
                        spotlight-color="primary"
                        to="/019bac87-026d-7ffa-912b-d867c2aa7926"
                    >
                        <template #header>
                            <span class="text-4xl">
                                😃
                            </span>
                        </template>
                        <template #footer>
                            <div class="flex flex-col gap-2">
                            <UAvatarGroup size="sm" :max="5">
                                <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
                                <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                                <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
                            </UAvatarGroup>     
                            <small>Updated 2 days ago</small> 
                            </div>      
                        </template>
                    </UPageCard>
                </div>
                <div class="flex justify-center">
                    <UButton size="sm" variant="soft" color="neutral" icon="i-lucide-arrow-down">
                        Load More
                    </UButton>
                </div>
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
const addOpen = ref(false)
</script>