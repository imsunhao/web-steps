import { GetUserConfig } from '@web-steps/config'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'

const getConfig: GetUserConfig = function() {
  return {
    test: '01-prod--web-steps',
    src: {
      SSR: {
        client: {
          webpack: getClientConfig
        },
        server: {
          webpack: getServerConfig
        }
      }
    }
  }
}

export default getConfig
