import { ProcessMessage } from '@types'
import { ProcessMessageMap } from './type'

export const NUMBER_OF_PROCESS_MESSAGE = 3

export function getProcessMessageMap() {
  let resolve: any
  let reject: any
  const p = new Promise<ProcessMessageMap>((r, j) => {
    resolve = r
    reject = j
  })
  if (process.send) {
    const messageMap: any = {}
    let length = 0
    process.on('message', ({ name, payload }: ProcessMessage) => {
      // console.log(name, payload)
      messageMap[name] = payload
      if (++length > NUMBER_OF_PROCESS_MESSAGE) {
        resolve()
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

export function cloneDeep<T>(data: T): T {
  if (typeof data !== 'object') return data
  if (data instanceof Array) {
    return data.map(d => {
      return cloneDeep(d)
    }) as any
  }
  return Object.keys(data).reduce((t: any, o) => {
    t[o] = cloneDeep((data as any)[o])
    return t
  }, {}) as any
}

function mergeBase(src: { [x: string]: any }, target: { [x: string]: any }, { isSimple }: any = {}) {
  if (typeof target !== 'object' || typeof src !== 'object') return target
  Object.keys(target).forEach(t => {
    if (typeof target[t] === 'object' && typeof src[t] === 'object') {
      if (isSimple) return
      src[t] = mergeBase(src[t], target[t])
    } else {
      src[t] = target[t]
    }
  })
  return src
}

export function merge(...args: any[]) {
  return args.reduce((t, o) => {
    if (!o) return t
    if (t === o) return t
    return mergeBase(t, cloneDeep(o))
  }, args[0])
}

export function mergeSimple(...args: any[]) {
  return args.reduce((t, o) => {
    if (!o) return t
    if (t === o) return t
    return mergeBase(t, cloneDeep(o), { isSimple: true })
  }, args[0])
}

export * from './type'
