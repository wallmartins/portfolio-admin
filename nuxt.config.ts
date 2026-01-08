// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  srcDir: 'app/',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/eslint'
    // '@nuxtjs/sentry' // Uncomment and configure when Sentry DSN is available
  ],

  typescript: {
    strict: true,
    typeCheck: true
  },

  // Sentry configuration (optional - uncomment when ready to use)
  // sentry: {
  //   dsn: process.env.SENTRY_DSN || '',
  //   enabled: !!process.env.SENTRY_DSN,
  //   config: {
  //     environment: process.env.NODE_ENV || 'development',
  //     tracesSampleRate: 1.0
  //   }
  // },

  runtimeConfig: {
    // Public keys (exposed to client)
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:9501',
      aiApiUrl: process.env.NUXT_PUBLIC_AI_API_URL || 'http://localhost:3001'
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

  // Component auto-imports configuration
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
        global: true
      }
    ]
  },

  // Performance optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  // Image optimization
  image: {
    formats: ['webp', 'avif', 'png', 'jpg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  // Experimental features for better performance
  experimental: {
    payloadExtraction: false,
    componentIslands: true,
    viewTransition: true
  },

  vite: {
    optimizeDeps: {
      include: ['@tanstack/vue-query']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', '@tanstack/vue-query'],
            'ui': ['reka-ui', 'lucide-vue-next']
          }
        }
      }
    }
  },

  // Router options for better navigation
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  }
})
