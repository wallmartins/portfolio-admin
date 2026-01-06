import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import {
  VueQueryPlugin,
  QueryClient,
  dehydrate,
  hydrate
} from '@tanstack/vue-query'

export default defineNuxtPlugin(nuxtApp => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        refetchOnWindowFocus: false
      }
    }
  })

  const options: VueQueryPluginOptions = {
    queryClient
  }

  nuxtApp.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload.vueQueryState = { toJSON: () => dehydrate(queryClient) }
    })
  }

  if (import.meta.client) {
    nuxtApp.hooks.hook('app:created', () => {
      hydrate(queryClient, nuxtApp.payload.vueQueryState)
    })
  }
})
