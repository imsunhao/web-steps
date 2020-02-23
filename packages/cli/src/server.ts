import { log, Execa } from './'
import { Args, ProcessMessage } from '@types'
import { processSend, processOnMessage } from 'packages/shared'

export function start(args: Args) {
  async function main() {
    const childProcess = Execa.runCommand('server', [], { isRead: false })
    processSend(childProcess, { messageKey: 'args', payload: args })
    if (!process.send || !__TEST__) {
      childProcess.disconnect()
    } else {
      processOnMessage(childProcess, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix, 'childProcess', payload.messageKey)
        if (payload.messageKey === 'exit') {
          childProcess.disconnect()
        } else {
          processSend(process, payload)
        }
      })
      processOnMessage(process, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix, 'process', payload.messageKey)
        if (payload.messageKey === 'e2e') {
          process.exit(0)
        }
      })
    }
  }
  main().catch(e => log.catchError(e))
}
