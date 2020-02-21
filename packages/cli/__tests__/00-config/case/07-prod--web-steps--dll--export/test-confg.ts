import { TTestConfig } from '../../../utils'
import { resolve } from 'path'

const testConfig: TTestConfig = {
  skip: false,
  cache: true,
  node: {
    rootDir: resolve(__dirname),
    target: 'web-steps',
    argv: ['export']
  },
  result: {
    export_config: {
      path: resolve(__dirname, './output/export_config.js'),
      result: {
        config: {
          rootDir: resolve(__dirname),
          src: {
            DLL: [
              'Vue.dll.ba8b48d92c6d571ce0b4.js',
              'VueRouter.dll.6c1b719a2fbf024644e9.js',
              'Vuex.dll.c32572a2cbdef26c588b.js'
            ]
          }
        }
      }
    }
  },
  close: true
}

export default testConfig
