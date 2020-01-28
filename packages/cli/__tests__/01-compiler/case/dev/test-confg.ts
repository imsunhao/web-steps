import { TTestConfig } from '../../compiler.spec'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: true,
  node: {
    target: 'web-steps--compiler'
  },
  result: {
    output: [
      {
        filePath: resolve('./dist/index.js')
      }
    ]
  },
  close: true
}

export default testConfig
