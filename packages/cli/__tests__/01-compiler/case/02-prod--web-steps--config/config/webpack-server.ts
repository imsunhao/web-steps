import path from 'path'
const resolve = (p: string) => path.resolve(__dirname, '../', p)

export default {
  name: 'server',
  mode: 'production',
  devtool: false,
  target: 'node',
  optimization: {
    minimize: false
  },
  entry: {
    index: resolve('./src/index.ts')
  },
  output: {
    path: resolve('./dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      }
    ]
  },
  plugins: []
}
