import { AxiosError, AxiosResponse, AxiosRequestConfig, AxiosStatic } from 'axios'
import { PromiseTypeEnhance } from '..'

export const encodeCookie = (cookies: any) => {
  let cookie = ''
  Object.keys(cookies).forEach(item => {
    cookie += `${item}=${cookies[item]};`
  })
  return cookie
}

export function createAxiosHelper<APIError>(
  axios: AxiosStatic,
  hostGlobal: { __INJECT_CONTEXT__: { SERVER_HOST: string } }
) {
  function handleErrorResponse(xhr: AxiosError) {
    const response = xhr
    const res: AxiosResponse<APIError> = response.response || ({} as any)

    const result = {
      statusCode: res.status,
      response,
      responseData: res.data
    }
    return result
  }
  type ErrorResponse = ReturnType<typeof handleErrorResponse>

  type RequesterOptions = AxiosRequestConfig & {
    cookies?: object
    /**
     * 默认 resolve 的是 response data, 如果需要原始的 AxiosResponse, 需要这个参数
     */
    returnOriginalResponse?: boolean
  }

  /**
   * 在 axios 的基础上添加简单的一些参数
   * - 提供对 cookies 的序列化
   */
  class Requester {
    /**
     * 实际用于请求的 axios, 可以是具有不同配置的实例
     */
    static axios = axios

    static request<T = any, E = ErrorResponse>(opts: RequesterOptions = {}) {
      const requestOpts = this.prepareOptions(opts)
      console.log(requestOpts)
      const promise: PromiseTypeEnhance<T, E> = new Promise<T>((resolve, reject) => {
        this.axios(requestOpts)
          .then((response: { data: T | PromiseLike<T> }) => {
            if (opts.returnOriginalResponse) {
              resolve(response as any)
            } else {
              resolve(response.data)
            }
          })
          .catch((xhr: AxiosError<any>) => {
            return reject(handleErrorResponse(xhr))
          })
      }).catch(err => {
        throw err
      })

      return promise
    }

    static prepareOptions(opts: RequesterOptions) {
      opts.headers = opts.headers || {}
      if (opts.cookies) {
        opts.headers.cookie = encodeCookie(opts.cookies)
      }
      return opts
    }
  }

  type ActorRequestOptions = RequesterOptions & {
    url?: string
    uri?: string
    id?: string | number
    action?: string
  }

  return class AxiosHelper<D> {
    apiPrefix = '/api'

    /**
     * 实例必须指定的 uri, 一般来说是 REST 中资源的名字, 拼 url 的时候会用到
     */
    uri = ''

    constructor(uri: string) {
      this.uri = uri
    }

    requestApi<T = D>(opts: ActorRequestOptions) {
      const url = this.getUrl(opts)
      return Requester.request<T>({
        ...opts,
        url
      })
    }

    getUrl(opts: ActorRequestOptions) {
      let url = opts.url
      if (!opts.url) {
        const id = opts.id
        const baseUri = opts.uri || this.uri
        url = baseUri ? `${this.apiPrefix}/${baseUri}` : this.apiPrefix
        if (id) {
          url = `${url}/${id}`
        }
        if (opts.action) {
          url = `${url}/${opts.action}`
        }
        if (process.env.VUE_ENV === 'server') {
          url = `${hostGlobal.__INJECT_CONTEXT__.SERVER_HOST}${url}`
        }
      }
      return url
    }

    post<T = D>(opts: ActorRequestOptions) {
      return this.requestApi<T>({ ...opts, method: 'post' })
    }

    get<T = D>(opts?: ActorRequestOptions) {
      return this.requestApi<T>({ ...opts, method: 'get' })
    }

    put<T = D>(opts: ActorRequestOptions) {
      return this.requestApi<T>({ ...opts, method: 'put' })
    }

    delete(opts: ActorRequestOptions) {
      return this.requestApi({ ...opts, method: 'delete' })
    }
  }
}
