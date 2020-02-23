import VueSSRServerPlugin from 'vue-server-renderer/server-plugin'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'

const webpackConfig: webpack.Configuration = {
  name: 'server',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: '@web-steps/helper/dist/remove-code-block.js',
            options: {
              VUE_ENV: 'server'
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: 'null-loader'
      },
      {
        test: /\.css$/,
        use: 'null-loader'
      }
    ]
  },
  externals: [nodeExternals()],
  performance: {
    maxEntrypointSize: 1024 * 1024 * 6,
    maxAssetSize: 1024 * 1024 * 3,
    hints: false
  },
  plugins: [
    new VueSSRServerPlugin(),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"server"'
    })
  ]
}

export default webpackConfig
