import { ProcessMessage } from '@types'
import { MessageMap } from '../type'

export function getMessageMap() {
  let resove: (value?: any) => void
  const p = new Promise<MessageMap>(r => {
    resove = r
  })
  if (process.send) {
    const messageMap: any = {}
    let length = 0
    process.on('message', ({ name, payload }: ProcessMessage) => {
      // console.log(name, payload)
      messageMap[name] = payload
      if (++length > 3) {
        resove()
      }
    })
  }
  return p
}
