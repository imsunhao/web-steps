import { AxiosRequestConfig } from 'axios'
import { RequestHandler } from 'express'

export type ResError = {
  code: number
  data?: any
}

export type AxiosRequestConfigPlus<DATA = any> = Omit<AxiosRequestConfig, 'data' | 'params'> & {
  data?: DATA
  params?: DATA
}


export type RouterConformation = {
  /**
   * 默认值: `/${key}`
   */
  path?: string
  /**
   * 请求方法
   * - 默认值 '*' // 将会使用 use 方法
   */
  method?: SERVER_ROUTER_METHOD
  children?: Record<string, RouterConformation>
}

export type ActorContext = {
  url: string
  method: string
}

export type POST<Req, Res> = RequestHandler<any, Res, Req, any>
