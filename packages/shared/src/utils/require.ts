import requireFromString from 'require-from-string'

type requireOptions = {
  fs: any
}

export function requireSourceString(path: string, opts: requireOptions = { fs: require('fs') }) {
  if (opts.fs.existsSync(path)) {
    let source = opts.fs.readFileSync(path, 'utf-8')
    if (/\.json$/.test(path)) {
      source = 'module.exports = ' + source
    }
    return source + ''
  }
}

export function requireFromPath(path: string, opts: requireOptions = { fs: require('fs') }) {
  const source = requireSourceString(path, opts)
  if (/\.html$/.test(path)) {
    return source
  }
  try {
    const md = requireFromString(source, path)
    return md.__esModule ? md.default : md
  } catch (error) {
    throw new Error(`[requireFromPath] ${path} not find!`)
  }
}
