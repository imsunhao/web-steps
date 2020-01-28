import { TTestConfig } from '../../compiler.spec'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  node: {
    target: 'web-steps',
    env: 'production'
  },
  webSteps: {
    target: 'SSR'
  },
  result: {
    output: [
      {
        filePath: resolve(__dirname, './dist/client.js')
      },
      {
        filePath: resolve(__dirname, './dist/server.js')
      }
    ]
  },
  close: true
}

export default testConfig
