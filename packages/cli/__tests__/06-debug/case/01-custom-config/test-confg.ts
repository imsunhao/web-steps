import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = true
const testConfig: TTestConfig = {
  vscodeDebug: debug,
  skip: false,
  cache: true,
  timeout: 20000,
  node: {
    target: 'web-steps',
    argv: ['build', '--dry', '--debug-port=8088', '--skip-build', '--debug-path=/web-steps'],
    rootDir: resolve(__dirname)
  },
  result: {
    debug: ['node --inspect-brk=8088 /web-steps', 'build --dry --skip-build']
  },
  close: true
}

export default testConfig
