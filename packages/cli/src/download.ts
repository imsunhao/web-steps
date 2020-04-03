import { Args, DOWNLOAD_MANIFEST_FILE } from '@types'
import { log } from './'
import { requireFromPath } from 'packages/shared'
import { createOSS } from '@web-steps/oss'
import path from 'path'
import fs from 'fs'

export function start(args: Args) {
  args.env = 'development'

  async function main() {
    let downloadManifestPath = args.downloadManifestPath

    if (!path.isAbsolute(downloadManifestPath)) {
      downloadManifestPath = path.resolve(args.rootDir, downloadManifestPath)
    }

    if (!fs.existsSync(downloadManifestPath)) {
      return log.error('can not find downloadManifestPath =', downloadManifestPath)
    }

    const downloadManifest: DOWNLOAD_MANIFEST_FILE = requireFromPath(downloadManifestPath)
    const OSS = createOSS(downloadManifest.oss.name, downloadManifest.oss.options)

    const downloadFileList = downloadManifest.base.map(p => {
      const pathInfo = path.parse(p)
      const nameSplitList = pathInfo.name.split('.')
      pathInfo.name = nameSplitList.slice(0, nameSplitList.length - 1).join('.')
      delete pathInfo.base
      pathInfo.dir = args.rootDir
      return {
        remoteFilePath: p,
        localFilePath: path.format(pathInfo)
      }
    })

    for (let i = 0; i < downloadFileList.length; i++) {
      const { remoteFilePath, localFilePath } = downloadFileList[i]
      await OSS.downloadFile(remoteFilePath, localFilePath)
    }

    log.info('下载完成')
  }
  main().catch(e => log.catchError(e))
}
