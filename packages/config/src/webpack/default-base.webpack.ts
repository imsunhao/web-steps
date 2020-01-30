import { VueLoaderPlugin } from 'vue-loader'

export default {
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
