import fs from 'fs'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const masterVersion = require('./package.json').version
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const name = path.basename(packageDir)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}

const knownExternals = fs.readdirSync(packagesDir).filter(p => {
  return true
})

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
  cjs: {
    dir: resolve('dist'),
    format: `cjs`
  }
}

const defaultFormats = ['cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.externalLiveBindings = false

  const shouldEmitDeclarations = process.env.TYPES != null && process.env.NODE_ENV === 'production' && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/__tests__']
    }
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const srcDir = resolve('src')
  const files = fs
    .readdirSync(srcDir)
    .filter(p => {
      return /\.ts/.test(p)
    })
    .map(path => resolve('src/' + path))

  return {
    input: files,
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external: knownExternals.concat(Object.keys(pkg.dependencies || [])),
    plugins: [
      json({
        namedExports: false
      }),
      tsPlugin,
      createReplacePlugin(),
      ...plugins
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }
}

function createReplacePlugin() {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${masterVersion}"`,
    // this is only used during tests
    __TEST__: `(process.env.NODE_ENV === 'test')`,
    // support options?
    // the lean build drops options related code with buildOptions.lean: true
    __FEATURE_OPTIONS__: !packageOptions.lean && !process.env.LEAN,
    __FEATURE_SUSPENSE__: true
  }
  // allow inline overrides like
  //__RUNTIME_COMPILE__=true yarn build runtime-core
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace(replacements)
}
