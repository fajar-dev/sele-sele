// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxthub/core',
    'nuxt-emoji-picker',
    'nuxt-vue3-google-signin'
  ],

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL,
      partykitHost: process.env.PARTYKIT_HOST
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    experimental: {
      componentDetection: true
    }
  },

  compatibilityDate: '2025-01-15',

  hub: {
    blob: true
  },

  vite: {
    optimizeDeps: {
      include: [
        'prosemirror-state',
        'prosemirror-tables',
        'prosemirror-view',
        'yjs',
        'y-partykit/provider'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
