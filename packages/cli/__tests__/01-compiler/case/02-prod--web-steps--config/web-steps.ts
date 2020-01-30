import { GetUserConfig } from '@web-steps/config'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'

const getConfig: GetUserConfig = function(startupOptions) {
  return {
    test: '01-prod--web-steps',
    src: {
      SSRWebpack: {
        client: getClientConfig(startupOptions),
        server: getServerConfig(startupOptions)
      }
    }
  }
}

export default getConfig
