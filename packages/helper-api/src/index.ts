import { Router as R } from 'express'
import { AxiosStatic as X, AxiosResponse, AxiosError } from 'axios'
import { ResError, RouterConformation, POST, AxiosRequestConfigPlus, ActorContext } from '@web-steps/helper-api/@types'

export type PromisePlus<T, E> = {
  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | undefined | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
  ): PromisePlus<R1 | R2, E>

  catch<TResult = never>(
    onrejected?: ((reason: E) => TResult | PromiseLike<TResult>) | undefined | null
  ): PromisePlus<T | TResult, E>

  finally(onfinally: () => void): any
}
export type AxiosPromisePlus<T, E> = PromisePlus<AxiosResponse<T>, AxiosError<E>>

type APIExtend = { req?: any; res?: any; err?: any }
type APIExtends = Record<string, APIExtend>
type APIExtendTypeHelper<T extends APIExtend, K extends keyof APIExtend, R> = T extends { [key in K]: APIExtend[K] }
  ? T[K]
  : R

export enum SERVER_ROUTER_METHOD {
  '*',
  GET,
  POST,
  PUT,
  DELETE
}

export function createRequestHelper<
  SRC extends Record<string, RouterConformation>,
  P1 extends keyof SRC,
  P2 extends keyof SRC[P1]['children'],
  P3 extends keyof SRC[P1]['children'][P2]['children'],
  P4 extends keyof SRC[P1]['children'][P2]['children'][P3]['children']
>(SRC: SRC) {
  type HRType<T, P extends APIExtends, E> = {
    use: <K extends T & keyof P>(key: K, handler: POST<P[K]['req'], P[K]['res'] | E>) => void
  }

  type RCP1<P1 extends keyof SRC> = SRC[P1]['children']
  type RCP2<P1 extends keyof SRC, P2 extends keyof RCP1<P1>> = SRC[P1]['children'][P2]['children']
  type RCP3<
    P1 extends keyof SRC,
    P2 extends keyof RCP1<P1>,
    P3 extends keyof RCP2<P1, P2>
  > = SRC[P1]['children'][P2]['children'][P3]['children']
  type RCP4<
    P1 extends keyof SRC,
    P2 extends keyof RCP1<P1>,
    P3 extends keyof RCP2<P1, P2>,
    P4 extends keyof RCP3<P1, P2, P3>
  > = SRC[P1]['children'][P2]['children'][P3]['children'][P4]['children']

  function createRouterHelper<P extends APIExtends, E = ResError>(router: R, p1: P1): HRType<keyof RCP1<P1>, P, E>
  function createRouterHelper<P extends APIExtends, E = ResError>(
    router: R,
    p1: P1,
    p2: P2
  ): HRType<keyof RCP2<P1, P2>, P, E>
  function createRouterHelper<P extends APIExtends, E = ResError>(
    router: R,
    p1: P1,
    p2: P2,
    p3: P3
  ): HRType<keyof RCP3<P1, P2, P3>, P, E>
  function createRouterHelper<P extends APIExtends, E = ResError>(
    router: R,
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4
  ): HRType<keyof RCP4<P1, P2, P3, P4>, P, E>
  function createRouterHelper<P extends APIExtends, E = ResError>(router: R, ...paths: string[]): any {
    let lib: RouterConformation = { children: SRC }
    paths.forEach(p => {
      lib = lib.children[p]
    })
    return {
      use: function<K extends keyof RouterConformation['children'] & keyof P>(
        key: K,
        handler: POST<P[K]['req'], P[K]['res'] | E>
      ) {
        const target = lib.children[key]
        const method = target.method || SERVER_ROUTER_METHOD['*']
        const path = target.path || `/${key}`

        switch (method) {
          case SERVER_ROUTER_METHOD['*']:
            router.use(path, handler)
            break
          case SERVER_ROUTER_METHOD.POST:
            router.post(path, handler)
            break
          case SERVER_ROUTER_METHOD.GET:
            router.get(path, handler)
            break
        }
      }
    }
  }

  type ARType<KS extends keyof P, P extends APIExtends, E> = <
    K extends KS,
    Req extends APIExtendTypeHelper<P[K], 'req', any>,
    Res extends APIExtendTypeHelper<P[K], 'res', any>,
    Err extends APIExtendTypeHelper<P[K], 'err', E>
  >(
    key: K,
    config?: AxiosRequestConfigPlus<Req>
  ) => AxiosPromisePlus<Res, Err>

  function createAxiosHelper<P extends APIExtends, E = ResError>(axios: X, p1: P1): ARType<keyof RCP1<P1>, P, E>
  function createAxiosHelper<P extends APIExtends, E = ResError>(
    axios: X,
    p1: P1,
    p2: P2
  ): ARType<keyof RCP2<P1, P2>, P, E>
  function createAxiosHelper<P extends APIExtends, E = ResError>(
    axios: X,
    p1: P1,
    p2: P2,
    p3: P3
  ): ARType<keyof RCP3<P1, P2, P3>, P, E>
  function createAxiosHelper<P extends APIExtends, E = ResError>(
    axios: X,
    p1: P1,
    p2: P2,
    p3: P3,
    p4: P4
  ): ARType<keyof RCP4<P1, P2, P3, P4>, P, E>
  function createAxiosHelper(axios: X, ...paths: string[]) {
    let lib: RouterConformation = { children: SRC }
    let url = ''
    paths.forEach(p => {
      lib = lib.children[p]
      url += lib.path || `/${p}`
    })

    function actor(this: ActorContext, options: AxiosRequestConfigPlus = {}) {
      return axios(
        Object.assign(
          {
            url: this.url,
            method: this.method
          },
          options
        )
      )
    }

    function getMethod(method: SERVER_ROUTER_METHOD) {
      switch (method) {
        case SERVER_ROUTER_METHOD.POST:
          return 'post'
        case SERVER_ROUTER_METHOD.GET:
          return 'get'
      }
    }

    const axiosHelper: any = function(key: string, data: any) {
      return axiosHelper[key](data)
    }
    axiosHelper.$contextMap = {}

    Object.keys(lib.children).forEach(key => {
      const target = lib.children[key]
      const context: ActorContext = {
        url: url + (target.path || `/${key}`),
        method: getMethod(target.method)
      }
      axiosHelper.$contextMap[key] = context
      axiosHelper[key] = actor.bind(context)
    })

    return axiosHelper
  }

  return {
    createRouterHelper,
    createAxiosHelper,
    SERVER_ROUTER_CONFORMATION: SRC
  }
}
