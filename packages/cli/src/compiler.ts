import { Execa } from 'shared/node'
import { Args, ProcessMessage } from '@types'
import { processSend, processOnMessage } from 'shared/node'

export function start(args: Args) {
  const childProcess = Execa.runCommand('compiler', [], { isRead: false })
  processSend(childProcess, { key: 'args', payload: args })
  if (!('send' in process) || !__TEST__) {
    childProcess.disconnect()
  } else {
    processOnMessage(childProcess, (payload: ProcessMessage) => {
      if (payload.key === 'exit') {
        childProcess.disconnect()
      } else {
        processSend(process, payload)
      }
    })
  }
}
