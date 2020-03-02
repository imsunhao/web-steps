import { ProcessMessage } from '@types'
import { ProcessMessageMap } from '../type'
import { ExecaChildProcess } from 'execa'

export function processOnMessage(p: NodeJS.Process | ExecaChildProcess<string>, fn: (p: ProcessMessage) => any) {
  p.on('message', (payload: any) => {
    console.debug('[onMessage]', 'messageKey =', payload.messageKey)
    fn(payload)
  })
}

export function processSend(
  p: NodeJS.Process | ExecaChildProcess<string>,
  payload: ProcessMessage,
  error?: () => void
) {
  if (p.send) {
    console.debug('[onSend]', 'messageKey =', payload.messageKey)
    p.send(payload)
  } else if (error) {
    error()
  }
}

export function getProcessMessageMap() {
  let resolve: any
  const p = new Promise<ProcessMessageMap>((r) => {
    resolve = r
  })
  const messageMap: ProcessMessageMap = {} as any
  processOnMessage(process, async ({ messageKey, payload }: ProcessMessage) => {
    if (messageKey === 'args') {
      messageMap.args = payload
      const c = require('@web-steps/config').config
      await c.init(messageMap.args)
      const { config, setting } = c
      messageMap.config = config
      messageMap.setting = setting
      resolve(messageMap)
    }
  })
  return p
}
