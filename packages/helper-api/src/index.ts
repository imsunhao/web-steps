import { Router as R, RequestHandler } from 'express'
// import { RequestHandler } from 'express-serve-static-core'
import { AxiosStatic as X, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export enum SERVER_ROUTER_METHOD {
  '*',
  GET,
  POST,
  PUT,
  DELETE
}

type PromisePlus<T, E> = {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromisePlus<TResult1 | TResult2, E>

  catch<TResult = never>(
    onrejected?: ((reason: E) => TResult | PromiseLike<TResult>) | undefined | null
  ): PromisePlus<T | TResult, E>

  finally(onfinally: () => void): any
}

type AxiosRequestConfigPlus<DATA = any> = Omit<AxiosRequestConfig, 'data' | 'params'> & {
  data?: DATA
  params?: DATA
}

type AxiosPromisePlus<T, E> = PromisePlus<AxiosResponse<T>, AxiosError<E>>

export type TRouterConformation = {
  /**
   * 默认值: `/${key}`
   */
  path?: string
  /**
   * 请求方法
   * - 默认值 '*' // 将会使用 use 方法
   */
  method?: SERVER_ROUTER_METHOD
  children?: Record<string, TRouterConformation>
}

export type TActorContext = {
  url: string
  method: string
}

export type ResError = {
  code: number
  data?: any
}

export function createRequestHelper<
  SRC extends Record<string, TRouterConformation>,
  P1 extends keyof SRC,
  P2 extends keyof SRC[P1]['children'],
  P3 extends keyof SRC[P1]['children'][P2]['children'],
  P4 extends keyof SRC[P1]['children'][P2]['children'][P3]['children']
>(SRC: SRC) {
  type POST<Req, Res> = RequestHandler<any, Res, Req, any>
  type APIExtends = Record<string, { req?: any; res?: any }>
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
  ): HRType<keyof RCP3<P1, P2, P3>[P4]['children'], P, E>
  function createRouterHelper<P extends APIExtends, E = ResError>(router: R, ...paths: string[]): any {
    let lib: TRouterConformation = { children: SRC }
    paths.forEach(p => {
      lib = lib.children[p]
    })
    return {
      use: function<K extends keyof TRouterConformation['children'] & keyof P>(
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

  type ARType<K extends keyof P, P extends APIExtends, E> = Record<
    K,
    <Req = P[K]['req'], Res = P[K]['res'], Error = E>(
      config?: AxiosRequestConfigPlus<Req>
    ) => AxiosPromisePlus<Res, Error>
  >

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
  ): ARType<keyof RCP3<P1, P2, P3>[P4]['children'], P, E>
  function createAxiosHelper(axios: X, ...paths: string[]) {
    let lib: TRouterConformation = { children: SRC }
    let url = ''
    paths.forEach(p => {
      lib = lib.children[p]
      url += lib.path || `/${p}`
    })

    function actor(this: TActorContext, options: AxiosRequestConfigPlus = {}) {
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

    const axiosHelper: any = {
      $map: {}
    }

    Object.keys(lib.children).forEach(key => {
      const target = lib.children[key]
      const context: TActorContext = {
        url: url + (target.path || `/${key}`),
        method: getMethod(target.method)
      }
      axiosHelper.$map[key] = context
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
