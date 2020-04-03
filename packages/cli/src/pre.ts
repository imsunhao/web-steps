import { Args, TFILES_MANIFEST } from '@types'
import { log } from './'
import { config, TConfig } from '@web-steps/config'
import { getDirFilePathObject, ensureDirectoryExistence, getMD5FilePath } from 'packages/shared'
import { writeFileSync } from 'fs'
import path from 'path'

export function start(args: Args) {
  args.env = 'development'

  const promiseList: Array<Promise<any>> = []

  const getStaticFilePathObject = (key: keyof TConfig & keyof TFILES_MANIFEST) => {
    const dirOption = config.config[key]
    const dirPath = dirOption.path
    return getDirFilePathObject(dirPath, dirOption, (obj, dirent, filePath) => {
      const resolve = config.resolve.bind(config)
      const promise = getMD5FilePath(filePath, resolve)
      promise.then(fileHash => {
        const filePathInfo = path.parse(filePath)
        const { name, ext } = filePathInfo
        filePathInfo.base = `${name}.${fileHash}${ext}`
        obj[dirent.name] = config.relative(path.format(filePathInfo))
      })
      promiseList.push(promise)
    })
  }

  async function main() {
    await config.init(args)
    const helperAssetsPath = config.resolve('src/helpers/assets.ts')

    ensureDirectoryExistence(helperAssetsPath)

    const PUBLIC_ASSETS = getStaticFilePathObject('public')
    const STATIC_ASSETS = getStaticFilePathObject('static')

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
