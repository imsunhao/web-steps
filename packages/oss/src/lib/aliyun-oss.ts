import { TAliyunOSSOption, OSSInterface, TAliyunCDNOptions } from '../type'
import path from 'path'
import fs from 'fs'
import OSS from 'ali-oss'
import co from 'co'

export class AliyunOss implements OSSInterface {
  name: TAliyunCDNOptions['name'] = 'aliyun'
  options: TAliyunOSSOption
  client: OSS

  constructor(options: TAliyunOSSOption) {
    this.options = options
    this.client = new OSS(this.options)
  }

  async headFile(filepath: string) {
    const client = this.client
    return co(function*() {
      return yield client.head(filepath)
    })
  }

  protected async doUploadFile(localFilePath: string, remoteFilePath: any) {
    const client = this.client
    const localFile = fs.readFileSync(localFilePath)
    const headers = this.formatHeaders(remoteFilePath)
    try {
      await new Promise(r => r())
      await co(function*() {
        return yield client.put(remoteFilePath, localFile, { headers })
      })
      console.log('Upload Success', remoteFilePath)
    } catch (error) {
      console.error('Upload Error', error.status, error.name, remoteFilePath)
    }
  }

  async downloadFile(remoteFilePath: string, localFilePath: any) {
    const client = this.client
    return co(function*() {
      return yield client.get(remoteFilePath, localFilePath)
    })
  }

  async uploadFile(localFilePath: string, remoteFilePath: string) {
    try {
      await this.headFile(remoteFilePath)
    } catch (error) {
      await this.doUploadFile(localFilePath, remoteFilePath)
    }
  }

  protected formatHeaders(remoteFilePath: string) {
    const headers: any = {}
    const ext = path.extname(remoteFilePath)
    if (ext === '.js') {
      // 否则在 Edge 下浏览器端拿到的 js 无法正确解码
      headers['Content-Type'] = 'application/javascript; charset=utf-8'
    }
    return headers
  }
}
