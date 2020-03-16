import { GetUserConfig } from '@web-steps/config'
import getBaseConfig from './config/webpack-base'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'
import { T_INJECT_CONTEXT } from './inject-content/type'

const getConfig: GetUserConfig<T_INJECT_CONTEXT> = function() {
  return {
    port: 8080,
    src: {
      SSR: {
        base: { webpack: getBaseConfig },
        client: { webpack: getClientConfig },
        server: {
          webpack: getServerConfig,
          exclude: [/only-client/],
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
