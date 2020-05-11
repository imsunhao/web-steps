import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = false
const testConfig: TTestConfig = {
  vscodeDebug: debug,
  skip: false,
  cache: true,
  timeout: 20000,
  node: {
    target: 'web-steps',
    argv: ['dev', '--dry'],
    rootDir: resolve(__dirname)
  },
  result: {
    debug: ['node --inspect-brk=32000 node_modules/@web-steps/cli/bin/web-steps', 'dev --dry']
  },
  close: true
}

export default testConfig
