import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  cache: false,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps'
  },
  webSteps: {
    target: 'SSR'
  },
  result: {
    cache: resolve(__dirname, './node_modules/.web-steps_cache/config.js')
  },
  close: true
}

export default testConfig
