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
                    client: [
                      'webpack-hot-middleware/client',
                      '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/04-dev--web-steps--export/src/entry-client.ts'
                    ]
                  },
                  mode: 'development'
                }
              }
            }
          }
        },
        setting: {
          entry:
            '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/04-dev--web-steps--export/config.ts',
          output:
            '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/04-dev--web-steps--export/temp',
          cache:
            '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/04-dev--web-steps--export/.web-steps_cache'
        }
      }
    }
  },
  close: true
}

export default testConfig
