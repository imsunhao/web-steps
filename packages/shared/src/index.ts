import { ProcessMessage } from '@types'
import { ProcessMessageMap } from './type'

export function getProcessMessageMap() {
  let resolve: any
  let reject: any
  const p = new Promise<ProcessMessageMap>((r, j) => {
    resolve = r
    reject = j
  })
  // console.log('[getProcessMessageMap]', !!process.send)
  if (process.send) {
    const messageMap: ProcessMessageMap = {} as any
    process.on('message', async ({ name, payload }: ProcessMessage) => {
      // console.log(name, payload)
      if (name === 'args') {
        messageMap.args = payload
        const c = require('@web-steps/config').config
        await c.init(messageMap.args)
        const { config, setting } = c
        messageMap.config = config
        messageMap.setting = setting
        resolve(messageMap)
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
    catchError(error: Error) {
      console.error('[catchError]', error)
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
