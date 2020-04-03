import { TAliyunCDNOptions, OSSInterface } from './type'
import { AliyunOss } from './lib/aliyun-oss'

export function createOSS(name: TAliyunCDNOptions['name'], options: any) {
  let OSS: OSSInterface
  if (name === 'aliyun') {
    OSS = new AliyunOss(options)
  }
  return OSS
}

export * from './type'
export * from './lib/aliyun-oss'
