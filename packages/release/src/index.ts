// import { Log, getEnv } from 'packages/shared'
// import { TReleaseConfig } from './type'

// const major = 'release'

// export let log: Log

// export async function start(payload: TReleaseConfig) {
//   async function main() {
//     const env = getEnv({ env: payload ? payload.env : __NODE_ENV__ })
//     log = new Log(major, { env })
//   }

//   await main().catch(err => log.catchError(err))
// }

export * from './type'
