// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/eslint'
  ],

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    // Private keys (only available server-side)
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,

    // Public keys (exposed to client)
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:9500',
      aiApiUrl: process.env.NUXT_PUBLIC_AI_API_URL || 'http://localhost:3001',
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID || ''
    }
  },

  app: {
    head: {
      title: 'Portfolio Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portfolio Admin Panel' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['@tanstack/vue-query']
    }
  }
})
