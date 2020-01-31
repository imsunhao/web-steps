import { VueLoaderPlugin } from 'vue-loader'
import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ args: { env, rootDir } }) {
  return {
    mode: env,
    context: rootDir,
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json']
    },
    output: {
      path: './dist',
      filename: '[name].[chunkhash].js'
    },
    module: {
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
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['ts-loader']
        }
      ]
    },
    plugins: [new VueLoaderPlugin()]
  }
}

export default getConfig
