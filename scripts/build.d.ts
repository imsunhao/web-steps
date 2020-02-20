type AnyFunction = (...args: any[]) => any

declare module '@web-steps/config' {
  type Config = any
  type TSetting = any
  type TServer<T> = any
  type TRender = any
  type TDLL = any
  type TGetWebpackConfig = AnyFunction
  type TGetDLLWebpackConfig = AnyFunction
  const config: any
  const defaultTemplatePath: any
}

declare module '@web-steps/compiler' {
  const start: any
}

declare module '@web-steps/helper' {
  type TRemoveCodeBlockOptions = any
}
