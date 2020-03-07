import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = false
const testConfig: TTestConfig = {
  vscodeDebug: debug,
  skip: true,
  cache: false,
  timeout: 20000,
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
        '#post': 'true',
        '#context': `INJECT_CONTEXT: {
  "SERVER_HOST": "http://127.0.0.1:8080",
  "TEST": "这是一个测试"
}`
      },
      async action({ text, click, page }) {
        await click('#add')
        const count = await text('#count')
        expect(count).toEqual('1')

        const color = await page.evaluate(() => {
          const element = document.getElementById('test1')
          element.focus()
          return window.getComputedStyle(element).getPropertyValue('color')
        })

        expect(color).toEqual('rgb(255, 0, 0)')
      }
    }
  },
  close: true
}

export default testConfig
