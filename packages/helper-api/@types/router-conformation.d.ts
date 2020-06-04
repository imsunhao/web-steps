




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