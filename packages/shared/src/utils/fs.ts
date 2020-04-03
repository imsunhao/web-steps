import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

export function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) return true
  fs.mkdirSync(dirname, { recursive: true })
}

export function getDirFilePathList(
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
      const childrenFilePathList = getDirFilePathList(filePath, opts)
      if (childrenFilePathList) {
        Array.prototype.push.apply(filePathList, childrenFilePathList)
      }
    }
  })

  return filePathList
}

export function getDirFilePathObject(
  dirPath: string,
  opts: {
    filters?: RegExp[]
  } = {},
  makeFilePath = (filePathObj: any, dirent: fs.Dirent, filePath: string) => {
    filePathObj[dirent.name] = filePath
  }
) {
  const filePathObj: any = {}
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
      makeFilePath(filePathObj, dirent, filePath)
    } else {
      const childrenFilePathList = getDirFilePathObject(filePath, opts, makeFilePath)
      if (childrenFilePathList) {
        filePathObj[dirent.name] = childrenFilePathList
      }
    }
  })

  return filePathObj
}

/**
 *
 * @param {(InputFileSystem|OutputFileSystem)=} fs a file system
 * @param {string} rootPath the root path
 * @param {string} targetPath the target path
 * @returns {string} location of targetPath relative to rootPath
 */
export function relative(fs: any, rootPath: string, targetPath: string): string {
  if (fs && fs.relative) {
    return fs.relative(rootPath, targetPath)
  } else if (rootPath.startsWith('/')) {
    return path.posix.relative(rootPath, targetPath)
  } else if (rootPath.length > 1 && rootPath[1] === ':') {
    return path.win32.relative(rootPath, targetPath)
  } else {
    throw new Error(
      `${rootPath} is neither a posix nor a windows path, and there is no 'relative' method defined in the file system`
    )
  }
}

/**
 * @param {(InputFileSystem|OutputFileSystem)=} fs a file system
 * @param {string} rootPath a path
 * @param {string} filename a filename
 * @returns {string} the joined path
 */
export function join(fs: any, rootPath: string, filename: string): string {
  if (fs && fs.join) {
    return fs.join(rootPath, filename)
  } else if (rootPath.startsWith('/')) {
    return path.posix.join(rootPath, filename)
  } else if (rootPath.length > 1 && rootPath[1] === ':') {
    return path.win32.join(rootPath, filename)
  } else {
    throw new Error(
      `${rootPath} is neither a posix nor a windows path, and there is no 'join' method defined in the file system`
    )
  }
}

/**
 * @param {(InputFileSystem|OutputFileSystem)=} fs a file system
 * @param {string} absPath an absolute path
 * @returns {string} the parent directory of the absolute path
 */
export function dirname(fs: any, absPath: string): string {
  if (fs && fs.dirname) {
    return fs.dirname(absPath)
  } else if (absPath.startsWith('/')) {
    return path.posix.dirname(absPath)
  } else if (absPath.length > 1 && absPath[1] === ':') {
    return path.win32.dirname(absPath)
  } else {
    throw new Error(
      `${absPath} is neither a posix nor a windows path, and there is no 'dirname' method defined in the file system`
    )
  }
}


export async function getMD5FilePath(filePath: string, resolve: (...args: any) => string) {
  return new Promise<string>(r => {
    const md5Hash = crypto.createHash('md5')
    const rs = fs.createReadStream(resolve(filePath))

    rs.on('data', data => {
      return md5Hash.update(data)
    })

    rs.on('end', () => {
      return r(md5Hash.digest('hex'))
    })
  })
}