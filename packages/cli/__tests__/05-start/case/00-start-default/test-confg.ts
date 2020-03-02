import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = false
const testConfig: TTestConfig = {
  vscodeDebug: debug,
  skip: false,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname)
  },
  result: {
    e2e: {
      debug,
      url: 'http://127.0.0.1:8080',
      texts: {
        '#test1': 'home Page',
        '#state': 'from server asyncData',
        '#count': '0',
        '#hasUser': 'true',
        '#get': 'true',
        '#post': 'true'
      },
      async action({ text, click, show }) {
        await click('#add')
        const count = await text('#count')
        if (show) console.log('#add', count)
        expect(count).toEqual('1')
      }
    }
  },
  close: true
}

export default testConfig
