import { catchError } from './utils/error'
import { Execa } from './utils/node'
import { Args, ProcessMessage } from '@types'

export function start(args: Args) {
  console.log('[compiler] start!')
  async function main() {
    const childProcess = Execa.runCommand('compiler', [], { isRead: false })
    childProcess.send({ name: 'args', payload: args })
    if (!process.send || !__TEST__) {
      childProcess.disconnect()
    } else {
      childProcess.on('message', (payload: ProcessMessage) => {
        if (payload.name === 'exit') {
          childProcess.disconnect()
        } else if (process.send) {
          process.send(payload)
        }
      })
    }
  }
  main().catch(err => catchError(err))
}
