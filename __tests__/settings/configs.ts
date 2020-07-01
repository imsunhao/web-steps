import { TestSetting, OnMessage } from '../types'

import path from 'path'
import { existsSync } from 'fs'

export const major = 'config'

export const onMessage: OnMessage = ({ message: { key, payload }, test }) => {
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
  },
  {
    name: '生成配置缓存',
    hash: '1b4d096eedbf59ba56c0fcfaca9721b1f1927da9',
    skip: false,
    onMessage({ message: { key, payload }, test }) {
      if (key === 'cache') {
        expect(existsSync(path.resolve(test.rootDir, './node_modules/.web-steps_cache/config.js'))).toBeTruthy()
      }
      if (key === 'config') {
        expect(payload).toMatchObject({ test: 'prod--web-steps' })
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
