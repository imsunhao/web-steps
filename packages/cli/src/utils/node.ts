import { merge } from 'packages/shared'
import execa from 'execa'
import { RunOptions, CustomRunOptions } from '../type'
import { log } from '../'

export const customRunOptionKeys: Array<keyof CustomRunOptions> = ['isRead', 'isSilence']

export class Execa {
  static run(bin: string, args: string[] = [], opts: RunOptions = {}) {
    if (opts.isSilence) {
      if (opts.stdio && opts.stdio instanceof Array) {
        opts.stdio[0] = 'ignore'
        opts.stdio[1] = 'ignore'
        opts.stdio[2] = 'ignore'
      } else {
        ;(opts as any).stdio = 'ignore'
      }
    }

    if (opts.isRead) {
      customRunOptionKeys.forEach(key => {
        delete opts[key]
      })
      log.log({ bin, args, opts: merge({ stdio: 'inherit' }, opts) })
      const childProcess: execa.ExecaChildProcess<string> = {} as any
      return childProcess
    }

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
   * 启用 Nodejs 并使用 IPC 进程通讯
   */
  static runCommand(command: string, args: string[] = [], opts: RunOptions = {}) {
    command = `${command}/bin/web-steps--${command}`
    const path = __TEST__ ? `packages/${command}` : `node_modules/@web-steps/${command}`
    return this.runNodeIPC([path, ...args], merge({ stdio: ['inherit', 'inherit', 'inherit', 'ipc'] }, opts))
  }
}
