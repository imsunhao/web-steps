import { GetUserConfig } from '@web-steps/config'
import getBaseConfig from './config/webpack-base'
import getClientConfig from './config/webpack-client'
import getServerConfig from './config/webpack-server'

const UPLOAD_SUPORT_EXTS = [
  '.txt',
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.gif',
  '.ttf',
  '.ico',
  '.otf',
  '.woff',
  '.woff2',
  '.svg',
  '.eot',
  '.mp4',
  '.html',
  '.json',
  '.wasm'
]

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
          exclude: [{ module: 'only-client', replace: resolve('./local_modules/only-server.ts') }]
        }
      },
      DLL: {
        Vue: 'vue',
        Vuex: { name: 'vuex', refs: ['Vue'] },
        VueRouter: { name: 'vue-router', refs: ['Vue'] }
      }
    },
    release: {
      cdn: {
        name: 'aliyun',
        options: {
          region: 'oss-cn-beijing',
          accessKeyId: 'accessKeyId',
          accessKeySecret: 'accessKeySecret'
        },
        suportExts: UPLOAD_SUPORT_EXTS
      },
      target: {
        stage: {
          host: 'https://stage.qingcut.com',
          cdn: {
            options: {
              staticHost: 'https://test.aliyuncs.com/stage',
              bucket: 'test'
            }
          },
          bin({ gitHash, downloadManifestPath }) {
            return `./scripts/deploy_stage.sh ${gitHash} ${downloadManifestPath}`
          }
        }
      }
    }
  }
}

export default getConfig
