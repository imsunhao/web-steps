import { getHostGlobal } from 'packages/shared'

const hostGlobal = getHostGlobal()

function getPathWithHost(path: string, host: string) {
  let value = path || ''
  if (host) {
    if (value.startsWith('/')) {
      value = value.slice(1)
    }
    if (host.endsWith('/')) {
      host = host.substring(0, host.length - 1)
    }
    value = `${host}/${value}`
  }
  return value
}

export class AssetsHelper {
  static makeWrapper<P, S>(
    payload: { PUBLIC_ASSETS: P; STATIC_ASSETS: S; dev?: boolean },
    host = hostGlobal.__INJECT_CONTEXT__.STATIC_HOST
  ) {
    const { PUBLIC_ASSETS, STATIC_ASSETS, dev: isDev } = payload
    function baseGetPath(prefix: string, assets: any, args: string[]) {
      let result: string
      if (isDev) {
        result = args.join('/')
      } else {
        for (let i = 0; i < args.length; i++) {
          const arg = args[i]
          result = assets[arg]
        }
      }

      return isDev ? getPathWithHost(result, prefix) : getPathWithHost(result, host)
    }

    function GPA<T extends P>(key: keyof T): string
    function GPA<T extends P, K extends keyof T>(k: K, k1: keyof T[K]): string
    function GPA<T extends P, K extends keyof T, K1 extends keyof T[K]>(
      k: K,
      k1: keyof T[K],
      k2: keyof T[K][K1]
    ): string
    function GPA<T extends P, K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1]>(
      k: K,
      k1: keyof T[K],
      k2: keyof T[K][K1],
      k3: keyof T[K][K1][K2]
    ): string
    function GPA(...args: any) {
      return baseGetPath('/public', PUBLIC_ASSETS, args)
    }

    function GSA<T extends P>(key: keyof T): string
    function GSA<T extends P, K extends keyof T>(k: K, k1: keyof T[K]): string
    function GSA<T extends P, K extends keyof T, K1 extends keyof T[K]>(
      k: K,
      k1: keyof T[K],
      k2: keyof T[K][K1]
    ): string
    function GSA<T extends P, K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1]>(
      k: K,
      k1: keyof T[K],
      k2: keyof T[K][K1],
      k3: keyof T[K][K1][K2]
    ): string
    function GSA(...args: any) {
      return baseGetPath('/static', STATIC_ASSETS, args)
    }

    return {
      getPublicAssets: GPA,
      getStaticAssets: GSA
    }
  }
}
