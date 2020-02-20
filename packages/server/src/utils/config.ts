import { getInitChildProcessConfig, getProcessMessageMap } from 'packages/shared'
import { log } from '..'
import { TServer, TSetting, TDLL } from '@web-steps/config'

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
  let server: TServer<'finish'>
  let setting: TSetting
  let dll: TDLL
  if (!__WEB_STEPS__ && false) {
  } else {
    try {
      processMessageMap = await getProcessMessageMap()
      server = processMessageMap.config.src.SSR.server
      setting = processMessageMap.setting
      dll = processMessageMap.config.src.DLL
    } catch (error) {
      log.error('未能找到 processMessageMap. 请确保 TODO 存在 或者 使用 yarn web-step 启动.')
    }
  }
  return {
    server,
    setting,
    dll
  }
}
