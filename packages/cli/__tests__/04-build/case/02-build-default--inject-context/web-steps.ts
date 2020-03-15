import { GetUserConfig } from '@web-steps/config'
import getBaseConfig from './config/webpack-base'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'

const getConfig: GetUserConfig = function({ resolve }) {
  return {
    src: {
      SSR: {
        base: { webpack: getBaseConfig },
        client: {
          webpack: getClientConfig
        },
        server: {
          webpack: getServerConfig,
          statics: {
            'common-assets': {
              path: resolve('./common-assets')
            }
          },
          exclude: [{ module: 'only-client', replace: resolve('./local_modules/only-server.ts') }]
        }
      },
      DLL: {
        Vue: 'vue',
        Vuex: { name: 'vuex', refs: ['Vue'] },
        VueRouter: { name: 'vue-router', refs: ['Vue'] }
      }
    }
  }
}

export default getConfig
