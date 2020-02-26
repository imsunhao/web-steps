import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  vscodeDebug: false,
  skip: false,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps',
    env: 'development',
    argv: ['export']
  },
  result: {
    export_config: {
      path: resolve(__dirname, './temp/export_config.js'),
      result: {
        args: {
          rootDir: resolve(__dirname)
        },
        config: {
          src: {
            SSR: {
              client: {
                webpack: {
                  entry: {
                    client: ['webpack-hot-middleware/client', resolve(__dirname, 'src/entry-client.ts')]
                  },
                  mode: 'development'
                }
              }
            }
          }
        }
      }
    }
  },
  close: true
}

export default testConfig
