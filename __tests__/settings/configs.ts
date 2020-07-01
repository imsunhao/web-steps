import { TestSetting, OnMessage } from '../types'

export const major = 'config'

export const onMessage: OnMessage = ({ message: { key, payload }, test, done }) => {
  if (key === 'config') {
    expect(payload).toMatchObject(test.expect.config)
  }
}

const tests: TestSetting[] = [
  {
    name: '读取默认配置',
    hash: '0c99a281746e1e0e0fa9d948c4b740eef4622d5e',
    skip: false,
    web_steps: {
      cache: true
    },
    expect: {
      config: {
        test: 'config-00__use-default-config-file'
      }
    }
  }
]

export const config = {
  name: '配置',
  tests,
  major,
  onMessage
}
