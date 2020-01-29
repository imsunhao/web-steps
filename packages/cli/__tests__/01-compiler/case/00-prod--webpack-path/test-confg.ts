import { TTestConfig } from '../../compiler.spec'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  node: {
    target: 'web-steps--compiler',
    env: 'production',
    argv: [`--webpack-path=${resolve(__dirname, './webpack.js')}`]
  },
  result: {
    output: [
      {
        name: 'config',
        filePath: resolve(__dirname, './dist/index.js')
      }
    ]
  },
  close: true
}

export default testConfig
