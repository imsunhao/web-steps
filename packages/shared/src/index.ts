import { ProcessMessage } from '@types'
import { ProcessMessageMap } from './type'

export const NUMBER_OF_PROCESS_MESSAGE = 3

export function getProcessMessageMap() {
  let resove: any
  let reject: any
  const p = new Promise<ProcessMessageMap>((r, j) => {
    resove = r
    reject = j
  })
  if (process.send) {
    const messageMap: any = {}
    let length = 0
    process.on('message', ({ name, payload }: ProcessMessage) => {
      // console.log(name, payload)
      messageMap[name] = payload
      if (++length > NUMBER_OF_PROCESS_MESSAGE) {
        resove()
      }
    })
  } else {
    reject()
  }
  return p
}

export function createErrorHandle(name: string) {
  return {
    getError(message: string) {
      return new Error(`[@web-steps/${name}] ${message}`)
    },
    catchError(error: Error): undefined {
      console.error(error)
      process.exit(1)
    }
  }
}

export * from './type'
