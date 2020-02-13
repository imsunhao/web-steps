import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: true,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname),
    env: 'production'
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
    ]
  },
  close: true
}

export default testConfig
