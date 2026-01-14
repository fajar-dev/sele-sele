// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxthub/core',
    'nuxt-emoji-picker',
    'nuxt-vue3-google-signin',
    '@vite-pwa/nuxt'
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

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: "SeleSele",
      short_name: "SeleSele",
      description: "SeleSele is a Notion alternative with AI-powered completions and real-time collaboration",
      lang: 'en',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#00c16a',
      icons: [
        {
          src: '/icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/icons/icon_144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {

          src: '/icons/icon_384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: '/icons/icon_512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
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
