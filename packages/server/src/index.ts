import { ServerConfig, ServerStart } from './type'
import { getInitConfig } from './utils'
import { Log, getEnv } from 'packages/shared'

const major = 'server'

export let log: Log

export async function start(payload?: ServerConfig) {
  async function main() {
    const env = getEnv({ env: payload ? payload.env : __NODE_ENV__ })
    log = new Log(major, { env })
    const startOptions: ServerStart = payload || (await getInitConfig())

    await require(`./${major}-${env}`).start(startOptions)
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
