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
