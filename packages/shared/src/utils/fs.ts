import path from 'path'
import fs from 'fs'

export function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) return true
  fs.mkdirSync(dirname, { recursive: true })
}

export function getDirFilesPath(
  dirPath: string,
  opts: {
    filters?: RegExp[]
  } = {}
) {
  const filePathList: string[] = []
  if (!fs.existsSync(dirPath)) {
    return false
    // throw new Error(`[getDirFilesPath] ${dirPath} not find!`)
  }
  const list = fs.readdirSync(dirPath, {
    encoding: 'utf-8',
    withFileTypes: true
  })

  const { filters } = opts

  list.forEach(dirent => {
    const filePath = path.resolve(dirPath, dirent.name)
    if (filters) {
      let checked = false
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i]
        if (filter.test(filePath)) {
          checked = true
          break
        }
      }
      if (!checked) return
    }

    if (!dirent.isDirectory()) {
      filePathList.push(filePath)
    } else {
      const childrenFilePathList = getDirFilesPath(filePath, opts)
      if (childrenFilePathList) {
        Array.prototype.push.apply(filePathList, childrenFilePathList)
      }
    }
  })

  return filePathList
}
