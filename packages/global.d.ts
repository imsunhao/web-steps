// NODE_ENV
declare let __DEV__: boolean
declare let __PRODUCTION__: boolean
declare let __TEST__: boolean
declare let __NODE_ENV__: 'development' | 'production'
declare let __WEB_STEPS__: boolean

declare let __DEBUG_PORT__: string

declare let __COMMIT__: string
declare let __VERSION__: string

// Feature flags
declare let __FEATURE_OPTIONS__: boolean
declare let __FEATURE_SUSPENSE__: boolean

//SSR

// eslint-disable-next-line no-var
declare var process: NodeJS.Process & {
  __INJECT_CONTEXT__: any
}
declare let __HOST_GLOBAL__: any
declare let __IS_SERVER__: boolean

type SniffPromise<T> = T extends Promise<infer P> ? P : unknown

// webpack

// eslint-disable-next-line @typescript-eslint/camelcase
declare let __webpack_require__: any

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'svgson' {
  const parseSync: any
  const stringify: any
}

declare module '@test' {
  function test(): void
}
