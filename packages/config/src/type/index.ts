export type UserConfig = {
  /**
   * 测试 专用字段
   * - 单元测试
   * - 用户设置此字段无意义,如果想审查用户配置,请导出静态配置
   */
  test?: string
}

export type StartupOptions = any

export type GetUserConfig = (startupOptions: StartupOptions) => UserConfig

export type TSetting = {
  /**
   * web-steps 配置文件 入口
   * - 默认值 web-steps.ts
   */
  entry: string

  /**
   * web-steps 输出目录
   * - 默认值 dist/web-steps
   */
  output: string

  /**
   * 注入自定义数据
   * - 注入的上下文 配置文件目录
   * - 没有默认值
   */
  injectContext: string

  /**
   * web-steps 缓存目录
   * - 存放配置文件
   * - 默认值 node_modules/web-steps_cache
   */
  cache: string
}

export type TOptionsInject = {}

export type TConfig = any
