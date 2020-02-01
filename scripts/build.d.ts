type AnyFunction = (...args: any[]) => any

declare module '@web-steps/config' {
  type TRender = any
  type TGetWebpackConfig = AnyFunction
  const config: any
}
