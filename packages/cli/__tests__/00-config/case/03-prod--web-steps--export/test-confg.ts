import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: true,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps',
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
                  mode: 'production'
                }
              },
              server: {
                lifeCycle: {}
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
