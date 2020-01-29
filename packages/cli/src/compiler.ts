import { catchError } from './utils/error'
import { Execa } from './utils/node'
import { Args, ProcessMessage } from '@types'
import { nodeProcessSend } from 'packages/shared'

export function start(args: Args) {
  async function main() {
    const childProcess = Execa.runCommand('compiler', [], { isRead: false })
    nodeProcessSend(childProcess, { messageKey: 'args', payload: args })
    if (!process.send || !__TEST__) {
      childProcess.disconnect()
    } else {
      childProcess.on('message', (payload: ProcessMessage) => {
        // console.log('[cli] start on message', payload)
        if (payload.messageKey === 'exit') {
          childProcess.disconnect()
        } else {
          nodeProcessSend(process, payload)
        }
      })
    }
  }
  main().catch(err => catchError(err))
}
