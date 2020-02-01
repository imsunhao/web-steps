import { createApp } from './app'

export default (context: any) => {
  return new Promise((resolve, reject) => {
    console.log('[entry-server]', context)
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(() => resolve(app), reject)
  })
}
