import { Args } from '@types'
import { log } from './'

import { start as releaseStart } from '@web-steps/release'
import { COMMON_HELPER_INFO } from 'shared/setting'
import { checkHelper } from 'shared/log'

const helperInfo = `
${COMMON_HELPER_INFO}
- UNIQUE
  skip-tests:            跳过测试
  skip-build:            跳过编译
  skip-deploy:           跳过上传
  skip-version:          跳过版本变更
  skip-changeLog:        跳过记录版本改动
  skip-git:              跳过 git 操作
  skip-run-bin:          跳过 执行自定义 bin 函数
  dry:                   只显示命令 并不执行
`

export function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'release',
      info: helperInfo
    },
    minorCommand: []
  })
  async function main() {
    args.env = 'production'
    await releaseStart(args)
  }
  main().catch(e => log.catchError(e))
}
