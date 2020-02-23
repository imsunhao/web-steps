const __HOST_GLOBAL__: any = window

import { createApp } from './app'

const { app, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (__HOST_GLOBAL__.__INITIAL_STATE__) {
  store.replaceState(__HOST_GLOBAL__.__INITIAL_STATE__)
}

__HOST_GLOBAL__.store = store

router.onReady(() => {
  app.$mount('#app')
})
