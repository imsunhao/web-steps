import { Args } from '@types'
import { log } from './'

import { COMMON_HELPER_INFO } from 'shared/setting'
import { checkHelper } from 'shared/log'
import execa from 'execa'
import { processSend } from 'shared/node'

const helperInfo = `
${COMMON_HELPER_INFO}
- UNIQUE
  debug-port:            调试端口号
  debug-path:            web-steps调试路径
  dry:                   只显示命令 并不执行
`

export function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'debug',
      info: helperInfo
    },
    minorCommand: []
  })
  async function main() {
    const { dry } = args
    const run = dry
      ? (bin: string, args: string[] = []) => {
          const result: any = `${bin} ${args.join(' ')}`
          log.log(result)
          return { stdout: result } as execa.ExecaChildProcess<string>
        }
      : (bin: string, args: any, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })

    const customArgs = process.argv.slice(2).filter(arg => {
      return !/^-*?debug/.test(arg)
    })

    const { stdout } = await run('node', [`--inspect-brk=${args.debugPort}`, args.debugPath, ...customArgs])

    if ('send' in process && __TEST__) {
      processSend(process, {
        key: 'debug',
        payload: stdout
      })
    }
  }
  main().catch(e => log.catchError(e))
}
