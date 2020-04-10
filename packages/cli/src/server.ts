import { log, Execa } from './'
import { Args, ProcessMessage } from '@types'
import { processSend, processOnMessage } from 'shared/node'

export function start(args: Args) {
  const childProcess = Execa.runCommand('server', [], { isRead: false })
  processSend(childProcess, { messageKey: 'args', payload: args })
  if (!('send' in process) || !__TEST__) {
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
