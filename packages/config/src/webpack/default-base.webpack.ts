import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { TGetWebpackConfig } from '@web-steps/config'
import webpack from 'webpack'
import { TERSER_PLUGIN_OPTIONS } from '../setting'

const getConfig: TGetWebpackConfig = function({ args: { env, rootDir } }) {
  const base: webpack.Configuration = {
    mode: env,
    context: rootDir,
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json']
    },
    output: {
      filename: '[name].[chunkhash].js'
    },
    optimization: {
      minimizer: [new TerserPlugin(TERSER_PLUGIN_OPTIONS)]
    },
    module: {
      noParse: /es6-promise\.js$/,
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        },
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[contenthash].css'
      })
    ]
  }

  return base
}

export default getConfig
