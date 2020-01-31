type AnyFunction = (...args: any[]) => any

declare module '@web-steps/config' {
  type TGetWebpackConfig = AnyFunction
  const config: any
}
