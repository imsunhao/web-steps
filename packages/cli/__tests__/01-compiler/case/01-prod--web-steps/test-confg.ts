import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname),
    env: 'production'
  },
  webSteps: {
    target: 'SSR'
  },
  result: {
    output: [
      {
        name: 'client',
        filePath: resolve(__dirname, './dist/client.js')
      },
      {
        name: 'server',
        filePath: resolve(__dirname, './dist/server.js')
      }
    ]
  },
  close: true
}

export default testConfig
