import { Args } from '@types'
import { config } from '@web-steps/config'
import { log } from './'
import { start as compilerStart } from '@web-steps/compiler'
import { sync as rmrfSync } from 'rimraf'
import { getCache } from 'packages/shared'

export function start(args: Args) {
  async function main() {
    args.env = 'production'
    const env = args.env

    await config.init(args, {
      getSettingCallBack(c) {
        if (!getCache(args)) {
          log.info('清空 输出目录:', c.setting.output)
          rmrfSync(c.setting.output)
        }
      }
    })

    if (args.target === 'SSR') {
      const SSR = config.config.src.SSR
      await compilerStart({
        webpackConfigs: [SSR.client.webpack, SSR.server.webpack],
        env
      })
    }
  }
  main().catch(e => log.catchError(e))
}
