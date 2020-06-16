import { createApp } from './app'
import { RouterReadyHelper } from '@web-steps/helper-vue-router'
import { VuexStoreHelper } from '@web-steps/helper-vuex'

export default (context: any) => {
  return new Promise((resolve, reject) => {
    console.log('[entry-server]')
    const { app, router, store } = createApp()
    router.push(context.url)
    router.onReady(async () => {
      await RouterReadyHelper.asyncData(router, { store, locals: { test: 'from server asyncData' } })
      VuexStoreHelper.injectStoreState(context, store)
      resolve(app)
    }, reject)
  })
}
