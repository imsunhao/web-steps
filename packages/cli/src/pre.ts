import { Args, TFILES_MANIFEST } from '@types'
import { log } from './'
import { config, TConfig } from '@web-steps/config'
import { getDirFilePathObject, ensureDirectoryExistence, getMD5FilePath } from 'shared/fs'
import { writeFileSync } from 'fs'
import path from 'path'

export function start(args: Args) {
  args.env = 'development'

  const promiseList: Array<Promise<any>> = []

  const getAssetsFilePathObject = (key: keyof TConfig & keyof TFILES_MANIFEST, md5?: boolean) => {
    const dirOption = config.config[key]
    const dirPath = dirOption.path
    return getDirFilePathObject(dirPath, dirOption, (obj, dirent, filePath) => {
      const resolve = config.resolve.bind(config)
      if (md5) {
        const promise = getMD5FilePath(filePath, resolve)
        promise.then(fileHash => {
          const filePathInfo = path.parse(filePath)
          const { name, ext } = filePathInfo
          filePathInfo.base = `${name}.${fileHash}${ext}`
          obj[dirent.name] = config.relative(path.format(filePathInfo))
        })
        promiseList.push(promise)
      } else {
        obj[dirent.name] = config.relative(filePath)
      }
    })
  }

  async function main() {
    await config.init(args)
    const helperAssetsPath = config.resolve('src/helpers/assets.ts')

    ensureDirectoryExistence(helperAssetsPath)

    const PUBLIC_ASSETS = getAssetsFilePathObject('public', true)
    const STATIC_ASSETS = getAssetsFilePathObject('static')

    await Promise.all(promiseList)

    const resource = `
export const PUBLIC_ASSETS = ${JSON.stringify(PUBLIC_ASSETS, null, 2)}

export const STATIC_ASSETS = ${JSON.stringify(STATIC_ASSETS, null, 2)}
`

    writeFileSync(helperAssetsPath, resource, 'utf-8')

    log.info('成功 输出目录:', helperAssetsPath)
  }
  main().catch(e => log.catchError(e))
}
