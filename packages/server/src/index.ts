import { ServerConfig, ServerStart } from './type'
import { getInitConfig } from './utils'
import { Log } from 'packages/shared'
import { getEnv } from 'shared/config'
import { SSRMessageBus } from '@types'

const major = 'server'

export let log: Log

export async function start(payload?: ServerConfig, opts?: { messageBus: SSRMessageBus }) {
  async function main() {
    const env = getEnv({ env: payload ? payload.env : __NODE_ENV__ })
    log = new Log(major, { env })
    const startOptions: ServerStart = payload || (await getInitConfig())

    await require(`./${major}-${env}`).start(startOptions, opts)
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
