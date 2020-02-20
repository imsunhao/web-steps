import { GetUserServerConfig } from '@web-steps/config'
import express from 'express'

import { APITest } from '../@types'

const getServerConfig: GetUserServerConfig = () => {
  return {
    beforeRender(req, res, next) {
      console.log('[beforeRender] 1', req.url, req.method, /^\/private/.test(req.url))
      if (/^\/private/.test(req.url)) {
        next()
      }
    },
    router(APP) {
      const router = express.Router()

      router.get('/test', (req, res) => {
        const json: APITest = {
          test: 'get'
        }
        res.json(json)
      })

      router.post('/test', (req, res) => {
        const json: APITest = {
          test: 'post'
        }
        res.json(json)
      })

      APP.use('/private', router)
    }
  }
}
export default getServerConfig
