import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  cache: true,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps'
  },
  webSteps: {
    target: 'SSR'
  },
  result: {
    config: {
      test: 'use-default-config-file'
    }
  },
  close: true
}

export default testConfig
