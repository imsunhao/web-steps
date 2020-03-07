type AnyFunction = (...args: any[]) => any

declare module '@web-steps/config' {
  type StartupOptions = any
  type Config = any
  type TConfig = any
  type TCredentials = any
  type TSetting = any
  type TServer<T> = any
  type TRender = any
  type TDLL = any
  type TGetWebpackConfig = AnyFunction
  type TGetDLLWebpackConfig = AnyFunction

  const config: any
  const defaultTemplatePath: any
  const DEFAULT_PORT: any
  const DEFAULT_INJECT_CONTEXT: any
}

declare module '@web-steps/compiler' {
  const start: any
}

declare module '@web-steps/helper' {
  type TRemoveCodeBlockOptions = any
}
