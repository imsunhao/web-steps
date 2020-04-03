import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { AliyunOss } from './aliyun-oss'
import {
  TDeplayUploadOptions,
  TDeplaydoUploadOptions,
  OSSInterface,
  TAliyunCDNOptions,
  TAliyunOSSOption
} from '../type'

export class Deploy {
  protected suportExts: string[]
  rootDir: string
  OSS: OSSInterface

  constructor(rootDir: string, options: TAliyunCDNOptions) {
    this.rootDir = rootDir
    this.suportExts = options.suportExts

    let OSS: OSSInterface
    if (options.name === 'aliyun') {
      OSS = new AliyunOss(options.options as TAliyunOSSOption)
    }
    this.OSS = OSS
  }

  protected resolve(p: string) {
    return path.resolve(this.rootDir, p)
  }

  protected async getMD5FilePath(filePath: string) {
    return new Promise<string>(resolve => {
      const md5Hash = crypto.createHash('md5')
      const rs = fs.createReadStream(this.resolve(filePath))

      rs.on('data', data => {
        return md5Hash.update(data)
      })

      rs.on('end', () => {
        return resolve(md5Hash.digest('hex'))
      })
    })
  }

  protected async doUpload({ filePath, remoteFilePath }: TDeplaydoUploadOptions) {
    await this.OSS.uploadFile(filePath, remoteFilePath)
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
      await this.doUpload({ filePath, remoteFilePath })
      remoteFileList.push(remoteFilePath)
    }
    return remoteFileList
  }
}
