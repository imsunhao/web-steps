import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = false
const testConfig: TTestConfig = {
  vscodeDebug: debug,
  skip: false,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname)
  },
  result: {
    output: [
      {
        name: 'client',
        filePath: resolve(__dirname, './dist/web-steps/vue-ssr-client-manifest.json')
      },
      {
        name: 'server',
        filePath: resolve(__dirname, './dist/web-steps/vue-ssr-server-bundle.json')
      }
    ],
    cache: {
      base: resolve(__dirname, './node_modules/.web-steps_cache/config.js'),
      dll: resolve(__dirname, './node_modules/.web-steps_cache/vue-ssr-dll-manifest.json'),
      SSR: resolve(__dirname, './node_modules/.web-steps_cache/life-cycle.js')
    },
    build: {
      filesManifest: {
        path: resolve(__dirname, './dist/web-steps/files-manifest.json'),
        content: {
          base: ['dist/web-steps/start-config.js']
        }
      }
    }
  },
  close: true
}

export default testConfig
