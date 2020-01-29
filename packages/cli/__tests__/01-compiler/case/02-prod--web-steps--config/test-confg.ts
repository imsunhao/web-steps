import { TTestConfig } from '../../compiler.spec'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: true,
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
    ],
    cache: resolve(__dirname, './node_modules/.web-steps_cache/config.js')
  },
  close: true
}

export default testConfig
