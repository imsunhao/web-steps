import { createApp } from './app'

export default (context: any) => {
  return new Promise((resolve, reject) => {
    const { url } = context

    const { app, router } = createApp()

    router.push(url)
    router.onReady(() => resolve(app), reject)
  })
}
