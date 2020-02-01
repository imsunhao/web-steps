import requireFromString from 'require-from-string'
import { readFileSync, existsSync } from 'fs'

export function requireFromPath(path: string) {
  if (existsSync(path)) {
    let source = readFileSync(path, 'utf-8')
    if (/\.json$/.test(path)) {
      source = 'module.exports = ' + source
    }
    const md = requireFromString(source, path)
    return md.__esModule ? md.default : md
  } else {
    new Error(`[@web-steps/shared] requireFromPath ${path} is not exists!`)
  }
}
