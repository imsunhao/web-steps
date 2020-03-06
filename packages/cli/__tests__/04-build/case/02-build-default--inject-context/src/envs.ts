import { Store } from 'vuex'

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
  __INJECT_CONTEXT__: any

  /**
   * vuex 实例
   */
  store: Store<any>
}

let hostGlobal: HostGlobal

try {
  hostGlobal = window as any

  hostGlobal.__INJECT_ENV__ = hostGlobal.__INJECT_ENV__ || {}
  hostGlobal.__INJECT_CONTEXT__ = hostGlobal.__INJECT_CONTEXT__ || {}
} catch (err) {
  hostGlobal = {} as any

  hostGlobal.__INJECT_ENV__ = process.env
  hostGlobal.__INJECT_CONTEXT__ = {
    SERVER_HOST: 'http://127.0.0.1:8080'
  }
}

export { hostGlobal }
