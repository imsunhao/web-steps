import { Args, TFILES_MANIFEST } from '@types'
import { log } from './'
import { config, TConfig } from '@web-steps/config'
import { getDirFilePathObject, ensureFolderExistence, getMD5FilePath } from 'shared/fs'
import { writeFileSync } from 'fs'
import path from 'path'
import { checkHelper } from 'shared/log'
import { COMMON_HELPER_INFO } from 'shared/setting'

const helperInfo = `
${COMMON_HELPER_INFO}
`

function objToArrayByKeysSort(obj: { [x: string]: any }) {
  const keysSorted = Object.keys(obj).sort(function(k1: any, k2: any) {
    return k1 - k2
  })
  return keysSorted.map(key => [key, obj[key]])
}

function arrayObjToString(arrayObj: any[], index = 1) {
  if (!(arrayObj instanceof Array)) arrayObj = objToArrayByKeysSort(arrayObj)
  let parentPrefix = ''
  let prefix = ''
  for (let i = 0; i < index; i++) {
    prefix += '\t'
    if (i) parentPrefix += '\t'
  }
  let str = '{'
  arrayObj.forEach((item: any[]) => {
    if (typeof item[1] === 'string') {
      str += `\n${prefix}${JSON.stringify(item[0])}: ${JSON.stringify(item[1])},`
    } else {
      str += `\n${prefix}${JSON.stringify(item[0])}: ${arrayObjToString(item[1], index + 1)},`
    }
  })
  if (arrayObj.length) str = str.slice(0, str.length - 1)
  str += `\n${parentPrefix}}`
  return str
}

export function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'pre',
      info: helperInfo
    },
    minorCommand: []
  })

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

    ensureFolderExistence(helperAssetsPath)

    const PUBLIC_ASSETS = getAssetsFilePathObject('public', true)
    const STATIC_ASSETS = getAssetsFilePathObject('static')

    await Promise.all(promiseList)

    const resource = `
export const PUBLIC_ASSETS = ${arrayObjToString(PUBLIC_ASSETS)}

export const STATIC_ASSETS = ${arrayObjToString(STATIC_ASSETS)}
`

    writeFileSync(helperAssetsPath, resource, 'utf-8')

    log.info('成功 输出目录:', helperAssetsPath)
  }
  main().catch(e => log.catchError(e))
}
