import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  vscodeDebug: true,
  skip: false,
  cache: true,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname)
  },
  result: {
    e2e: {
      debug: true,
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
