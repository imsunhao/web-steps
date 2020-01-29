import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: true,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps--compiler'
  },
  result: {
    output: [
      {
        name: 'test',
        filePath: resolve('./dist/index.js')
      }
    ]
  },
  close: true
}

export default testConfig
