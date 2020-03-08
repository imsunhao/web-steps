import { GetUserConfig } from '@web-steps/config'
import getBaseConfig from './config/webpack-base'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'
import { T_INJECT_CONTEXT } from './inject-content/type'

const getConfig: GetUserConfig<T_INJECT_CONTEXT> = function({ resolve }) {
  return {
    port: 8000,
    injectContext: resolve('inject-content/stage.ts'),
    src: {
      SSR: {
        base: { webpack: getBaseConfig },
        client: { webpack: getClientConfig },
        server: {
          webpack: getServerConfig,
          proxyTable: injectContext => ({
            '/api': {
              target: injectContext.SERVER_HOST,
              changeOrigin: true
            },
            '/websocket': {
              target: injectContext.SERVER_HOST,
              changeOrigin: true,
              ws: true
            }
          })
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
