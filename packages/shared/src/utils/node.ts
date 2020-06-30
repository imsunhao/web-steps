import { ProcessMessage } from '@types'
import { ProcessMessageMap } from '../type'
import { ExecaChildProcess, Options } from 'execa'
import { merge } from 'shared/lodash'

export function processOnMessage(p: NodeJS.Process | ExecaChildProcess<string>, fn: (p: ProcessMessage) => any) {
  p.on('message', (payload: any) => {
    console.debug('[onMessage]', 'messageKey =', payload.messageKey)
    fn(payload)
  })
}

export function processSend(
  p: NodeJS.Process | ExecaChildProcess<string>,
  payload: ProcessMessage,
  error?: () => void
) {
  if (p.send) {
    console.debug('[onSend]', 'messageKey =', payload.key)
    p.send(payload)
  } else if (error) {
    error()
  }
}

export function getProcessMessageMap() {
  let resolve: any
  const p = new Promise<ProcessMessageMap>(r => {
    resolve = r
  })
  const messageMap: ProcessMessageMap = {} as any
  processOnMessage(process, async ({ key: messageKey, payload }: ProcessMessage) => {
    if (messageKey === 'args') {
      messageMap.args = payload
      const c = require('@web-steps/config').config
      await c.init(messageMap.args)
      const { config, setting } = c
      messageMap.config = config
      messageMap.setting = setting
      resolve(messageMap)
    }
  })
  return p
}

export type RunOptions = Options<string> & CustomRunOptions

export type CustomRunOptions = {
  /**
   * 是否启用 只读模式
   * - 不会真正运行
   */
  isRead?: boolean

  /**
   * 是否启用 沉默运行
   */
  isSilence?: boolean

  /**
   * 环境变量
   */
  envs?: Record<string, string>
}

export const customRunOptionKeys: Array<keyof CustomRunOptions> = ['isRead', 'isSilence', 'envs']

export class Execa {
  static run(bin: string, args: string[] = [], opts: RunOptions = {}) {
    if (opts.isSilence && opts.stdio != 'pipe') {
      if (opts.stdio && opts.stdio instanceof Array) {
        opts.stdio[0] = 'ignore'
        opts.stdio[1] = 'ignore'
        opts.stdio[2] = 'ignore'
      } else {
        (opts as any).stdio = 'ignore'
      }
    }

    if (opts.envs) {
      args.unshift(bin)
      bin = 'cross-env'
      Object.keys(opts.envs).forEach(key => {
        args.unshift(`${key}=${opts.envs[key]}`)
      })
    }

    if (opts.isRead) {
      opts = merge({}, opts)
      customRunOptionKeys.forEach(key => {
        delete opts[key]
      })
      console.log({ bin, args, opts: merge({ stdio: 'inherit' }, opts) })
      const childProcess: ExecaChildProcess<string> = {} as any
      return childProcess
    }

    const execa: (...args: any) => ExecaChildProcess<string> = require('execa')
    return execa(bin, args, merge({ env: process.env, stdio: 'inherit' }, opts))
  }

  static runNode(args: string[] = [], opts: RunOptions = {}) {
    if (__DEBUG_PORT__) {
      args = [`--inspect-brk=${__DEBUG_PORT__}`, ...args]
      process.env.DEBUG_PORT = parseInt(__DEBUG_PORT__) + 1 + ''
    }
    return this.run('node', args, opts)
  }

  /**
   * 启用 Nodejs 并使用 IPC 进程通讯
   */
  static runNodeIPC(args: string[] = [], opts: RunOptions = {}) {
    return this.runNode(args, merge({ stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }, opts))
  }

  /**
   * 启用 bin/web-steps--command 并使用 IPC 进程通讯
   */
  static runCommand(command: string, args: string[] = [], opts: RunOptions = {}) {
    command = `${command}/bin/web-steps--${command}`
    const path = __TEST__ ? `packages/${command}` : `node_modules/@web-steps/${command}`
    return this.runNodeIPC([path, ...args], merge({ stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }, opts))
  }
}
