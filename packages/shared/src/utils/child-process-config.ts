import minimist from 'minimist'
import { ProcessMessageMap } from 'packages/shared'

export function getInitChildProcessConfig(): {
  localArgs: any
  processMessageMap: ProcessMessageMap
} {
  const localArgs = minimist(process.argv.slice(2))
  const processMessageMap: any = {}
  return {
    localArgs,
    processMessageMap
  }
}
