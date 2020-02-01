import { getInitChildProcessConfig, getProcessMessageMap } from 'packages/shared'
import { log, ServerLifeCycle } from '..'
import { TRender } from '@web-steps/config'

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
  let lifeCycle: Required<ServerLifeCycle> = {} as any
  let render: TRender = {} as any
  if (!__WEB_STEPS__ && false) {
  } else {
    try {
      processMessageMap = await getProcessMessageMap()
      lifeCycle = processMessageMap.config.src.SSR.server.lifeCycle
      render = processMessageMap.config.src.SSR.server.render
    } catch (error) {
      log.error('未能找到 processMessageMap. 请确保 TODO 存在 或者 使用 yarn web-step 启动.')
    }
  }
  return {
    lifeCycle,
    render
  }
}
