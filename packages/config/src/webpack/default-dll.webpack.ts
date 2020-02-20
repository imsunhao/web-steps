import webpack from 'webpack'
import { join } from 'path'
import { TGetDLLWebpackConfig } from '@web-steps/config'

const getDllWebpackConfig: TGetDLLWebpackConfig = function({ entry, outputPath, context, refs }) {
  const libraryName = '[name]_[hash]_DLL'
  const config: webpack.Configuration = {
    name: 'dll',
    mode: 'development',
    entry,
    context,
    output: {
      path: outputPath,
      filename: '[name].dll.[hash].js',
      library: libraryName
    },
    resolve: {
      extensions: ['.js']
    },
    performance: {
      maxEntrypointSize: 1024 * 500,
      maxAssetSize: 1024 * 500,
      hints: 'warning'
    },
    plugins: [
      new webpack.DllPlugin({
        path: join(outputPath, '[name].manifest.json'),
        name: libraryName
      })
    ]
  }

  if (refs) {
    const keys = Object.keys(refs)
    keys.forEach(name => {
      const manifest = refs[name]
      config.plugins.push(
        new webpack.DllReferencePlugin({
          context,
          manifest
        })
      )
    })
  }
  return config
}

export default getDllWebpackConfig
