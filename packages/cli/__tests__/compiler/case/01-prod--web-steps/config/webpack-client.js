const path = require('path')
const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  name: 'client',
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
    filename: 'client.js',
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
