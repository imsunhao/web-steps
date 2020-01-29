// NODE_ENV
declare var __DEV__: boolean
declare var __PRODUCTION__: boolean
declare var __TEST__: boolean

declare var __DEBUG_PORT__: boolean

declare var __COMMIT__: string
declare var __VERSION__: string

// Feature flags
declare var __FEATURE_OPTIONS__: boolean
declare var __FEATURE_SUSPENSE__: boolean

type SniffPromise<T> = T extends Promise<infer P> ? P : unknown
