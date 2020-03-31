import { GetUserConfig } from '@web-steps/config'
import getBaseConfig from './config/webpack-base'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'

const getConfig: GetUserConfig = function({ resolve }) {
  return {
    port: 8040,
    public: {
      path: resolve('./public'),
      filters: [/.txt$/]
    },
    src: {
      SSR: {
        base: { webpack: getBaseConfig },
        client: { webpack: getClientConfig },
        server: {
          webpack: getServerConfig,
          render: {
            templatePath: resolve('index.template.html')
          }
        }
      }
    }
  }
}

export default getConfig
