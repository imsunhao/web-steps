import { TestSetting, OnMessage } from '../types'

export const major = 'config'

export const onMessage: OnMessage = ({ payload }, { config }) => {
  expect(payload).toMatchObject(config)
}

const tests: TestSetting[] = [
  {
    name: '基础默认配置',
    hash: '0c99a281746e1e0e0fa9d948c4b740eef4622d5e',
    setting: ({ rootDir }) => ({
      skip: false,
      cache: true,
      node: {
        rootDir,
        target: 'web-steps'
      },
      webSteps: {
        target: 'SSR'
      }
    }),
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
  onMessage,
}