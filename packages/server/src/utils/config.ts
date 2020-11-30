import { getInitChildProcessConfig } from 'shared/child-process-config'
import { getProcessMessageMap } from 'shared/node'
import { log } from '..'
import { TServer } from '@web-steps/config'

// eslint-disable-next-line prefer-const
let { processMessageMap, localArgs } = getInitChildProcessConfig()

export class Args {
  get args(): any {
    if (processMessageMap.args) return processMessageMap.args.args
    return localArgs
  }

  /**
   * 环境变量
   * - 内容发生变化 需要同步考虑 src/index.ts
   */
  get env(): 'production' | 'development' {
    return this.args.env || process.env.NODE_ENV || 'production'
  }
}

export const args = new Args()

export async function getInitConfig() {
  try {
    processMessageMap = await getProcessMessageMap()
    const server: TServer<'finish'> = processMessageMap.config.src.SSR.server
    const setting = processMessageMap.setting
    const dll = processMessageMap.config.src.DLL

    // TODO 这三应该是 env环境变量 中 获取
    const injectContext = processMessageMap.config.injectContext
    const port = processMessageMap.config.port
    const INJECT_ENV = processMessageMap.config.INJECT_ENV

    let credentials
    if (processMessageMap.config.dev) {
      credentials = processMessageMap.config.dev.credentials
    }
    return {
      server,
      setting,
      dll,
      injectContext,
      credentials,
      INJECT_ENV,
      port
    }
  } catch (error) {
    log.error('未能找到 processMessageMap. 请确保 TODO 存在 或者 使用 yarn web-step 启动.')
  }
}
