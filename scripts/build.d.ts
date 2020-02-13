type AnyFunction = (...args: any[]) => any

declare module '@web-steps/config' {
  type TSetting = any
  type TServer<T> = any
  type TRender = any
  type TGetWebpackConfig = AnyFunction
  const config: any
}

declare module '@web-steps/compiler' {
  const start: any
}

declare module '@web-steps/helper' {
  type TRemoveCodeBlockOptions = any
}
