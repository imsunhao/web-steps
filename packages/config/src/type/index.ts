import webpack from 'webpack'
import serveStatic from 'serve-static'
import proxy from 'http-proxy-middleware'
import { ServerLifeCycle } from '@web-steps/server'
import { Args } from '@types'

export type UserConfig = {
  /**
   * 测试 专用字段
   * - 单元测试
   * - 用户设置此字段无意义,如果想审查用户配置,请导出静态配置
   */
  test?: string
} & Partial<TBaseConfig<'ready'>>

export type StartupOptions = any

export type GetUserConfig = (startupOptions: StartupOptions) => UserConfig
export type GetUserServerConfig = (startupOptions: StartupOptions) => ServerLifeCycle

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
   * web-steps 缓存目录
   * - 存放配置文件
   * - 默认值 node_modules/web-steps_cache
   */
  cache: string
}

export type TOptionsInject = {}

export type TPlugin = any

export type TWebpackConfig<T extends 'finish' | 'ready'> = T extends 'finish'
  ? webpack.Configuration
  : (webpack.Configuration | TGetWebpackConfig)

export type TConfig = TBaseConfig<'finish'>

export type TDirOptions = {
  path: string
  filters?: RegExp[]
}

type TBaseConfig<T extends 'finish' | 'ready'> = {
  /**
   * 根目录 默认值为运行命令的目录
   */
  rootDir: string

  /**
   * server运行端口号
   * - 默认值 8080
   */
  port: string | number

  /**
   * 注入自定义数据
   * - 注入的上下文 配置文件目录
   * - 默认值 ./inject-context.js
   */
  injectContext: string

  /**
   * 公共资源库
   * - 资源库 一对多 服务器
   * - 默认值 path: './common-asset'
   * - 默认值 filters: undefined
   */
  'common-asset': TDirOptions

  /**
   * 资源库
   * - 资源库 一对一 服务器
   * - 默认值 path: './public'
   * - 默认值 filters: undefined
   */
  public: TDirOptions

  /**
   * 编译选项
   */
  compiler: {
    babelrc?: any
  }

  /**
   * 插件系统
   */
  plugins: TPlugin[]

  /**
   * 额外 webpack 配置文件 可以共享使用 web-steps 中的设置
   */
  customBuild: Array<TWebpackConfig<T>>

  /**
   * 源码配置
   */
  src: T extends 'finish' ? TSrc<T> : Partial<TSrc<T>>
}

type TWebpack<T extends 'finish' | 'ready'> = {
  webpack: TWebpackConfig<T>
}

type TSrc<T extends 'finish' | 'ready'> = {
  /**
   * Server Side Render 配置
   */
  SSR: {
    server: (T extends 'finish' ? TServer<T> : Partial<TServer<T>>) & TWebpack<T> & {}
    client: (T extends 'finish' ? TClient : Partial<TClient>) & TWebpack<T>
  } & (T extends 'finish' ? TSSR<T> : Partial<TSSR<T>>)

  /**
   * webpack - dll模块
   * - 可以为空, 不启用
   * - 内容: 名称 - 第三方包名称
   * 例如
   * ```
   * {
   *   Vue: 'vue'
   *   Vuex: { name: 'vuex', ref: 'Vue'}
   * }
   * ```
   */
  DLL?: T extends 'finish' ? TDLL : Record<string, string | Required<TDLLEntry>>
}

type TDLLEntry = { name: string; refs?: string[] }

export type TDLL = Record<string, TDLLEntry>

export type TClient = {}

export type TServer<T extends 'finish' | 'ready'> = {
  /**
   * 声明周期钩子函数, 控制 服务器 生命周期
   * - 入口路径 默认 rootDir/server/life-cycle
   * - dev 模式 支持 服务器 热重载
   */
  lifeCycle: T extends 'finish' ? Required<ServerLifeCycle> : string

  /**
   * 渲染配置
   */
  render: T extends 'finish' ? TRender : Partial<TRender>

  /**
   * 静态文件配置
   * - false 为 不设置
   * - undefined 为 启用默认配置
   * - 默认 设置的Output 目录 为 静态文件目录
   */
  statics?:
    | {
        [key: string]: ServeStaticOptions
      }
    | false

  /**
   * 转发列表
   * - false 为不启用
   */
  proxyTable?:
    | {
        [key: string]: proxy.Config
      }
    | false

  /**
   * 注入环境变量
   * - false 为 不注入
   * - undefined 为 默认注入
   * - 默认注入 xxx
   */
  env?: string[] | false
}

interface ServeStaticOptions extends serveStatic.ServeStaticOptions {
  path: string
}

export type TRender = {
  /**
   * vue-ssr-server-bundle.json 地址
   * - 默认为 webpack出口目录下/vue-ssr-server-bundle.json
   */
  bundlePath: string

  /**
   * vue-ssr-client-manifest.json 地址
   * - 默认为 webpack出口目录下/vue-ssr-client-manifest.json
   */
  clientManifestPath: string

  /**
   * HTML模板地址
   * - 如果不填写 默认为 一个简单的模板
   */
  templatePath: string
}

type TSSR<T extends 'finish' | 'ready'> = {
  base: TWebpack<T>

  /**
   * 排除三方包
   * - 防止过度打包,减小打包后的体积
   */
  exclude: any
}

export type TGetWebpackConfig = (startupOptions: StartupOptions, config: TConfig) => webpack.Configuration
export type TGetDLLWebpackConfig = (
  options: { entry: any; outputPath: string; context: string; refs?: Record<string, any> }
) => webpack.Configuration

export type TGetConfigPayload = {
  target: Args['target'] | 'base' | 'dll'
}
