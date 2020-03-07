import { HostGlobal } from '../@types'

let hostGlobal: HostGlobal

try {
  hostGlobal = window as any

  hostGlobal.__INJECT_ENV__ = hostGlobal.__INJECT_ENV__ || ({} as any)
  hostGlobal.__INJECT_CONTEXT__ = hostGlobal.__INJECT_CONTEXT__ || ({} as any)
} catch (err) {
  hostGlobal = {} as any
  hostGlobal.__INJECT_ENV__ = process.env
  hostGlobal.__INJECT_CONTEXT__ = process.__INJECT_CONTEXT__
}

export { hostGlobal }
