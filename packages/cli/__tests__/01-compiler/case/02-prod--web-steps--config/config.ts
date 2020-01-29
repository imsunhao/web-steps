import { GetUserConfig } from '@web-steps/config'
import clientConfig from './config/webpack-client'
import serverConfig from './config/webpack-server'

const getConfig: GetUserConfig = function() {
  return {
    test: '01-prod--web-steps',
    src: {
      SSRWebpack: {
        client: clientConfig,
        server: serverConfig
      }
    }
  }
}

export default getConfig
