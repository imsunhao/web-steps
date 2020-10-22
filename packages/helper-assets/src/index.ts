import { getHostGlobal } from 'shared/SSR'

const hostGlobal = getHostGlobal()

function getPathWithHost(path: string, host: string) {
  let value = path || ''
  if (host && host !== '/') {
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
    payload: { PUBLIC_ASSETS: P; STATIC_ASSETS: S; dev?: boolean; addHost?: boolean },
    host = hostGlobal.__INJECT_CONTEXT__.STATIC_HOST
  ) {
    const { PUBLIC_ASSETS, STATIC_ASSETS, dev: isDev, addHost } = payload
    function baseGetPath(prefix: string, assets: any, args: string[]) {
      let result: string
      if (isDev) {
        result = args.join('/')
      } else {
        let stepAssets = assets
        for (let i = 0; i < args.length; i++) {
          stepAssets = stepAssets[args[i]]
        }
        result = stepAssets
      }
      return isDev
        ? getPathWithHost(result, addHost ? getPathWithHost(prefix, host) : prefix)
        : getPathWithHost(result, host)
    }

    function GPA<T extends P>(key: keyof T): string
    function GPA<T extends P, K extends keyof T, K1 extends keyof T[K]>(k: K, k1: K1): string
    function GPA<T extends P, K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1]>(
      k: K,
      k1: K1,
      k2: K2
    ): string
    function GPA<
      T extends P,
      K extends keyof T,
      K1 extends keyof T[K],
      K2 extends keyof T[K][K1],
      K3 extends keyof T[K][K1][K2]
    >(k: K, k1: K1, k2: K2, k3: K3): string
    function GPA<
      T extends P,
      K extends keyof T,
      K1 extends keyof T[K],
      K2 extends keyof T[K][K1],
      K3 extends keyof T[K][K1][K2],
      K4 extends keyof T[K][K1][K2][K3]
    >(k: K, k1: K1, k2: K2, k3: K3, k4: K4): string
    function GPA<
      T extends P,
      K extends keyof T,
      K1 extends keyof T[K],
      K2 extends keyof T[K][K1],
      K3 extends keyof T[K][K1][K2],
      K4 extends keyof T[K][K1][K2][K3],
      K5 extends keyof T[K][K1][K2][K3][K4]
    >(k: K, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): string
    function GPA(...args: any) {
      return baseGetPath('/public', PUBLIC_ASSETS, args)
    }

    function GSA<T extends S>(key: keyof T): string
    function GSA<T extends S, K extends keyof T, K1 extends keyof T[K]>(k: K, k1: K1): string
    function GSA<T extends S, K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1]>(
      k: K,
      k1: K1,
      k2: K2
    ): string
    function GSA<
      T extends S,
      K extends keyof T,
      K1 extends keyof T[K],
      K2 extends keyof T[K][K1],
      K3 extends keyof T[K][K1][K2]
    >(k: K, k1: K1, k2: K2, k3: K3): string
    function GSA<
      T extends S,
      K extends keyof T,
      K1 extends keyof T[K],
      K2 extends keyof T[K][K1],
      K3 extends keyof T[K][K1][K2],
      K4 extends keyof T[K][K1][K2][K3]
    >(k: K, k1: K1, k2: K2, k3: K3, k4: K4): string
    function GSA<
      T extends S,
      K extends keyof T,
      K1 extends keyof T[K],
      K2 extends keyof T[K][K1],
      K3 extends keyof T[K][K1][K2],
      K4 extends keyof T[K][K1][K2][K3],
      K5 extends keyof T[K][K1][K2][K3][K4]
    >(k: K, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): string
    function GSA(...args: any) {
      return baseGetPath('/static', STATIC_ASSETS, args)
    }

    return {
      getPublicAssets: GPA,
      getStaticAssets: GSA
    }
  }
}
