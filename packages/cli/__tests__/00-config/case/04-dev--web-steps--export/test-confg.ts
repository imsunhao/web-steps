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
    EXPORT_CONFIG: {
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
                },
                exclude: []
              },
              server: {
                exclude: [
                  {
                    exclude: true,
                    module: /\.css$/,
                    replace: '@web-steps/config/dist/empty-module.js'
                  },
                  {
                    module: /\?vue&type=style/,
                    replace: '@web-steps/config/dist/empty-module.js'
                  }
                ],
                whitelist: [/\.css$/, /\?vue&type=style/]
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
