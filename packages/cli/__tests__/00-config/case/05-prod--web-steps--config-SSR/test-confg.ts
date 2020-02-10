import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  cache: false,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps'
  },
  result: {
    cache: {
      base: resolve(__dirname, './node_modules/.web-steps_cache/config.js'),
      SSR: resolve(__dirname, './node_modules/.web-steps_cache/life-cycle.js')
    }
  },
  close: true
}

export default testConfig
