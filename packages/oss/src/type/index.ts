import OSS from 'ali-oss'

/**
 * aliyun OSS 使用配置
 */
export type TAliyunOSSOption = OSS.Options

export interface TDeployOption {
  /**
   * 获取到的参数
   * - 运行时自动注入
   */
  options?: any

  /**
   * 输入的发布类型
   */
  RELEASE_AS_SUPPORT?: string[]

  /**
   * CDN 配置信息
   */
  CDN_OPTIONS: Record<
    string,
    Record<
      string,
      {
        /**
         * 资源静态地址
         */
        staticHost: string
        /**
         * 存储空间名称
         */
        bucket: string
      }
    >
  >

  /**
   * 服务器地址
   */
  SERVER_HOST: { [k in string]: string }

  /**
   * OSS 静态配置
   */
  aliyunOSSOption: TAliyunOSSOption

  /**
   * 支持上传文件后缀
   */
  UPLOAD_SUPORT_EXTS: string[]

  /**
   * 需要添加 hash后缀的文件 目录
   */
  hashFileList: string[]

  deployCallBack: (opts: TCallBackOptions) => void
  buildCallBack: (opts: TCallBackOptions) => void
}

type TCallBackOptions = {
  resolve: any
  reject: (error?: any) => void
  filepath?: string
  type?: 'build' | 'dev'
  options: TDeployOptions
}

export type TDeployOptions = {
  skipBuild?: boolean
  deployEnv: string
  uploadTo: string
  gitHash: string
}

export type TGetOptions = {
  hashFileList?: string[]
  isCommon?: boolean
  with_md5?: boolean
}

type TCDNOptions = {
  /**
   * OSS 公网地址
   */
  staticHost?: string
}

export type TAliyunCDNOptions = TCDNOptions & {
  name: 'aliyun'
  options: Partial<OSS.Options>
  /**
   * 允许上传的文件后缀
   */
  suportExts: string[]
}

export type TDeplayUploadOptions = {
  md5?: boolean
  remoteDirPath: string
}

export type TDeplaydoUploadOptions = {
  filePath: string
  remoteFilePath: string
}

export abstract class OSSInterface {
  abstract async uploadFile(localFilePath: string, remoteFilePath: string): Promise<any>
  abstract async downloadFile(remoteFilePath: string, localFilePath: string): Promise<any>
}
