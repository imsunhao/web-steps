const uniq = require('lodash.uniq')

const isJS = function(file: string) {
  return /\.js(\?[^.]+)?$/.test(file)
}

const isCSS = function(file: string) {
  return /\.css(\?[^.]+)?$/.test(file)
}

const onEmit = function(
  compiler: {
    hooks: { emit: { tapAsync: (arg0: any, arg1: any) => void } }
    plugin: (arg0: string, arg1: any) => void
  },
  name: string,
  hook: (compilation: any, cb: any) => void
) {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.emit.tapAsync(name, hook)
  } else {
    // Webpack < 4.0.0
    compiler.plugin('emit', hook)
  }
}

const ManifestPlugin = function(this: any, options: {}) {
  if (options === void 0) options = {}

  this.options = Object.assign(
    {
      filename: 'manifest.json'
    },
    options
  )
}

ManifestPlugin.prototype.apply = function apply(compiler: any) {
  const this$1 = this

  onEmit(compiler, 'manifest-plugin', function(
    compilation: {
      getStats: () => { (): any; new (): any; toJson: { (): any; new (): any } }
      assets: { [x: string]: { source: () => string; size: () => number } }
    },
    cb: () => void
  ) {
    const stats = compilation.getStats().toJson()

    const allFiles = uniq(
      stats.assets.map(function(a: { name: any }) {
        return a.name
      })
    )

    const initialFiles = uniq(
      Object.keys(stats.entrypoints)
        .map(function(name) {
          return stats.entrypoints[name].assets
        })
        .reduce(function(assets, all) {
          return all.concat(assets)
        }, [])
        .filter(function(file: any) {
          return isJS(file) || isCSS(file)
        })
    )

    const asyncFiles = allFiles
      .filter(function(file: any) {
        return isJS(file) || isCSS(file)
      })
      .filter(function(file: any) {
        return initialFiles.indexOf(file) < 0
      })

    const manifest: any = {
      publicPath: stats.publicPath,
      all: allFiles,
      initial: initialFiles,
      async: asyncFiles
    }

    const json = JSON.stringify(manifest, null, 2)
    compilation.assets[this$1.options.filename] = {
      source: function() {
        return json
      },
      size: function() {
        return json.length
      }
    }
    cb()
  })
}

module.exports = ManifestPlugin
