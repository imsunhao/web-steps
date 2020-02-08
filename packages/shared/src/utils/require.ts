import requireFromString from 'require-from-string'
import { readFileSync, existsSync } from 'fs'

export function requireSourceString(path: string) {
  if (existsSync(path)) {
    let source = readFileSync(path, 'utf-8')
    if (/\.json$/.test(path)) {
      source = 'module.exports = ' + source
    }
    if (/\.html$/.test(path)) {
      return source
    }
    return source
  } else {
    new Error(`[@web-steps/shared] requireSourceString ${path} is not exists!`)
  }
}

export function requireFromPath(path: string) {
  const source = requireSourceString(path)
  const md = requireFromString(source, path)
  return md.__esModule ? md.default : md
}
