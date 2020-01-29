import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps'
  },
  webSteps: {
    target: 'SSR'
  },
  result: {
    config: {
      test: 'use-config-file'
    }
  },
  close: true
}

export default testConfig
