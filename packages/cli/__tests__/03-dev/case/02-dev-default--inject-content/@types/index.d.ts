import { Store } from 'vuex'
import { T_INJECT_CONTEXT } from '../inject-content/type'

declare namespace WebSteps {
  type ErrorMessage = { code: number; code_description: string; message: string; field: string; field_key: string }
  type APIError = {
    messages: ErrorMessage[]
    code: number
  }
  type APITest = {
    test: 'get' | 'post'
  }

  interface HostGlobal extends Window {
    /**
     * vuex 自动注入 state
     * - 来着 服务端
     */
    __INITIAL_STATE__: any

    /**
     * 注入 环境 信息
     */
    __INJECT_ENV__: any

    /**
     * 注入 服务器配置信息
     */
    __INJECT_CONTEXT__: T_INJECT_CONTEXT

    /**
     * vuex 实例
     */
    store: Store<any>
  }
}

export = WebSteps
