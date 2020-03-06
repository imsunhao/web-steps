import { createAxiosHelper } from '@web-steps/helper'
import axios from 'axios'
import { hostGlobal } from '../envs'
import { APIError } from '../../@types'

const Axioshelper = createAxiosHelper<APIError>(axios, hostGlobal)

/**
 * 用于业务请求的类, url 形式基于 REST 惯例, 使用时需要实例化
 */
export default class ApiActor<D> extends Axioshelper<D> {
  apiPrefix = '/private'
}
