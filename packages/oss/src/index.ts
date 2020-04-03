import { TConfig } from '@web-steps/config'
import { merge } from 'packages/shared'
import { TAliyunCDNOptions } from './type'
import { Deploy } from './utils/deploy'

export function createDeploy(rootDir: string, target: string, options: TConfig['release']) {
  const ossOptions: TAliyunCDNOptions = merge({}, options.cdn, options.target[target].cdn)
  return new Deploy(rootDir, ossOptions)
}

export * from './type'
export * from './utils/aliyun-oss'
export * from './utils/deploy'
