import { GetUserConfig } from '@web-steps/config'
import getBaseConfig from './config/webpack-base'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'

const getConfig: GetUserConfig = function() {
  return {
    test: '01-prod--web-steps',
    src: {
      SSR: {
        base: { webpack: getBaseConfig },
        client: { webpack: getClientConfig },
        server: { webpack: getServerConfig }
      }
    }
  }
}

export default getConfig
