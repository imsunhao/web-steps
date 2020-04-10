import path from 'path'
import { TDeplayUploadOptions, TDeplaydoUploadOptions, OSSInterface, TAliyunCDNOptions, createOSS } from '@web-steps/oss'
import { getMD5FilePath } from 'shared/fs'
import { TConfig } from '@web-steps/config'
import { merge } from 'shared/lodash'

export class Deploy {
  protected suportExts: string[]
  rootDir: string
  OSS: OSSInterface

  constructor(rootDir: string, options: TAliyunCDNOptions) {
    this.rootDir = rootDir
    this.suportExts = options.suportExts

    this.OSS = createOSS(options.name, options.options)
  }

  protected resolve(p: string) {
    return path.resolve(this.rootDir, p)
  }

  protected async getMD5FilePath(filePath: string) {
    const resolve = this.resolve.bind(this)
    return await getMD5FilePath(filePath, resolve)
  }

  protected async doUpload({ localFilePath, remoteFilePath }: TDeplaydoUploadOptions) {
    await this.OSS.uploadFile(localFilePath, remoteFilePath)
  }

  async upload(fileList: string[], { md5, remoteDirPath }: TDeplayUploadOptions) {
    const remoteFileList: string[] = []
    for (let i = 0; i < fileList.length; i++) {
      const filePath = fileList[i]
      const filePathInfo = path.parse(filePath)
      if (!this.suportExts.find(ext => ext === filePathInfo.ext)) continue
      let remoteFilePath = path.resolve(remoteDirPath, filePath)
      if (md5) {
        const fileHash = await this.getMD5FilePath(filePath)
        const remoteFilePathInfo = path.parse(remoteFilePath)
        const { name, ext } = remoteFilePathInfo
        remoteFilePathInfo.base = `${name}.${fileHash}${ext}`
        remoteFilePath = path.format(remoteFilePathInfo)
      }
      await this.doUpload({ localFilePath: this.resolve(filePath), remoteFilePath })
      remoteFileList.push(remoteFilePath)
    }
    return remoteFileList
  }
}

export function createDeploy(rootDir: string, target: string, options: TConfig['release']) {
  const ossOptions: TAliyunCDNOptions = merge({}, options.cdn, options.target[target].cdn)
  return new Deploy(rootDir, ossOptions)
}
