import { GetUserConfig } from '@web-steps/config'

const getUserConfig: GetUserConfig = function() {
  return {
    test: '01-prod--web-steps',
    customBuild: [
      ({ resolve }) => {
        return {
          name: 'test-config-1',
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
            filename: 'test-config-1.js',
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
      },
      ({ resolve }) => {
        return {
          name: 'test-config-2',
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
            filename: 'test-config-2.js',
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
      }
    ]
  }
}

export default getUserConfig
