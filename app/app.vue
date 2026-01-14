<script setup>
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.webmanifest' }  
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'SeleSele'
const description = 'SeleSele is a Notion alternative with AI-powered completions and real-time collaboration'
const toaster = { position: 'top-right' }

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <UApp :toaster="toaster">
      <NuxtPage />
  </UApp>
</template>
