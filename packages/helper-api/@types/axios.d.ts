import { AxiosRequestConfig } from 'axios'

export type AxiosRequestConfigPlus<DATA = any> = Omit<AxiosRequestConfig, 'data' | 'params'> & {
  data?: DATA
  params?: DATA
}