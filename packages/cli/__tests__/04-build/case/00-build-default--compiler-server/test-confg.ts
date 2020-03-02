import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = true
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
      SSR: resolve(__dirname, './node_modules/.web-steps_cache/life-cycle.js')
    },
    build: {
      filesManifest: {
        path: resolve(__dirname, './dist/web-steps/files-manifest.json'),
        content: {
          base: ['dist/web-steps/start-config.js'],
          dll: [],
          template: ['index.template.html'],
          public: ['public/text.txt'],
          'common-asset': []
        }
      }
    }
  },
  close: true
}

export default testConfig
