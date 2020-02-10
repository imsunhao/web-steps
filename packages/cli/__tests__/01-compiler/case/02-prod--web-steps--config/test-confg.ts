import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  cache: false,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps'
  },
  webSteps: {
    target: 'custom'
  },
  result: {
    output: [
      {
        name: 'test-config-1',
        filePath: resolve(__dirname, './dist/test-config-1.js')
      },
      {
        name: 'test-config-2',
        filePath: resolve(__dirname, './dist/test-config-2.js')
      }
    ],
    cache: {
      base: resolve(__dirname, './node_modules/.web-steps_cache/config.js')
    }
  },
  close: true
}

export default testConfig
