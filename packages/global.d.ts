// NODE_ENV
declare var __DEV__: boolean
declare var __PRODUCTION__: boolean
declare var __TEST__: boolean
declare var __NODE_ENV__: 'development' | 'production'
declare var __WEB_STEPS__: boolean

declare var __DEBUG_PORT__: string

declare var __COMMIT__: string
declare var __VERSION__: string

// Feature flags
declare var __FEATURE_OPTIONS__: boolean
declare var __FEATURE_SUSPENSE__: boolean

//SSR

declare var __HOST_GLOBAL__: any
declare var __IS_SERVER__: boolean

type SniffPromise<T> = T extends Promise<infer P> ? P : unknown

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
