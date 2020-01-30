import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import webpack from 'webpack'

const webpackConfig: webpack.Configuration = {
  name: 'client',
  plugins: [
    new VueSSRClientPlugin(),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    })
  ]
}

export default webpackConfig