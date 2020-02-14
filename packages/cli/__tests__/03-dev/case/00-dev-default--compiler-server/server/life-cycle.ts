import { GetUserServerConfig } from '@web-steps/config'
import express from 'express'
const getServerConfig: GetUserServerConfig = () => {
  return {
    beforeRender(req, res, next) {
      console.log('[beforeRender] 1', req.url, /^\/private/.test(req.url))
      if (/^\/private/.test(req.url)) {
        next()
      }
    },
    router(APP) {
      const router = express.Router()
      router.get('/test', (req, res) => {
        res.json({
          test: 'hello word'
        })
      })

      APP.use('/private', router)
    }
  }
}
export default getServerConfig
