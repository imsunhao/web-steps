import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  cache: true,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname)
  },
  result: {
    e2e: {
      url: 'http://127.0.0.1:8080',
      texts: {
        '#test1': 'home Page',
        '#state': 'from server asyncData',
        '#count': '0',
        '#hasUser': 'true'
      }
    }
  },
  close: true
}

export default testConfig
