import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  vscodeDebug: true,
  skip: false,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps',
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
                  mode: 'production'
                }
              }
            }
          }
        },
        setting: {
          entry:
            '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/03-prod--web-steps--export/config.ts',
          output:
            '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/03-prod--web-steps--export/temp',
          cache:
            '/Users/sunhao/Documents/imsunhao/utils/packages/cli/__tests__/00-config/case/03-prod--web-steps--export/.web-steps_cache'
        }
      }
    }
  },
  close: true
}

export default testConfig
