import webpack from 'webpack'
import { join } from 'path'
import { TGetDLLWebpackConfig } from '@web-steps/config'

const ManifestPlugin = require('@web-steps/helper/dist/manifest-plugin')

const getDllConfig: TGetDLLWebpackConfig = function({ entry, outputPath, context }) {
  const config: webpack.Configuration = {
    name: 'dll',
    mode: 'production',
    entry,
    output: {
      path: outputPath,
      filename: '[name].dll.[chunkhash].js'
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
        context,
        path: join(outputPath, '[name].manifest.json'),
        name: '[name]'
      }),
      new ManifestPlugin({
        filename: 'vue-ssr-dll-manifest.json'
      })
    ]
  }
  return config
}

export default getDllConfig
