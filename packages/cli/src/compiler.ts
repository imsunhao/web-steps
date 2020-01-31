import { log, Execa } from './'
import { Args, ProcessMessage } from '@types'
import { processSend, processOnMessage } from 'packages/shared'

export function start(args: Args) {
  async function main() {
    const childProcess = Execa.runCommand('compiler', [], { isRead: false })
    processSend(childProcess, { messageKey: 'args', payload: args })
    if (!process.send || !__TEST__) {
      childProcess.disconnect()
    } else {
      processOnMessage(childProcess, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix)
        if (payload.messageKey === 'exit') {
          childProcess.disconnect()
        } else {
          processSend(process, payload)
        }
      })
    }
  }
  main().catch(log.catchError)
}
