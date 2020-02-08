import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: true,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps'
  },
  result: {
    config: {
      test: 'use-config-file'
    }
  },
  close: true
}

export default testConfig
