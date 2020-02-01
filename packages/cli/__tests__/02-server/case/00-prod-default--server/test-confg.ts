import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname),
    env: 'production'
  },
  result: {
    e2e: {
      url: 'http://127.0.0.1:8080',
      texts: {
        p: 'home page'
      }
    }
  },
  close: true
}

export default testConfig
