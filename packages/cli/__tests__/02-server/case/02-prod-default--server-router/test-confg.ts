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
      debug: false,
      url: 'http://127.0.0.1:8080',
      texts: {
        '#test1': 'home Page',
        '#state': 'from server asyncData',
        '#hasUser': 'true'
      }
    }
  },
  close: true
}

export default testConfig
