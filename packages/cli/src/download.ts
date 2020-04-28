import { Args, DOWNLOAD_MANIFEST_FILE } from '@types'
import { log } from './'
import { requireFromPath } from 'shared/require'
import { createOSS } from '@web-steps/oss'
import path from 'path'
import fs from 'fs'
import { checkHelper } from 'shared/log'
import { COMMON_HELPER_INFO } from 'shared/setting'

const helperInfo = `
${COMMON_HELPER_INFO}
- UNIQUE
  download-manifest-path:  下载 manifest 路径
`

export function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'download',
      info: helperInfo
    },
    minorCommand: []
  })

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
      pathInfo.dir = path.join(args.rootDir, pathInfo.dir)
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
