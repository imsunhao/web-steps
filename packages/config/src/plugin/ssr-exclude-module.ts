import { TSSRExcludeModuleOptions, TExcludeModuleOption } from '../type'
import { Compiler } from 'webpack'
import { join, dirname } from 'packages/shared'

const DEFAULT_REPLACE = '@web-steps/config/dist/empty-module.js'

export class SSRExcludeModulePlugin {
  options: TSSRExcludeModuleOptions

  optionsList: TExcludeModuleOption[]

  replaceList: TExcludeModuleOption[]

  get isDebug() {
    return this.options.debug
  }

  constructor(options: TSSRExcludeModuleOptions) {
    this.options = options
    this.optionsList = this.options.list.map(options => {
      if (typeof options === 'string' || !('module' in options)) {
        return {
          module: options,
          replace: DEFAULT_REPLACE
        }
      } else if (!options.replace) {
        options.replace = DEFAULT_REPLACE
      }
      return options
    })
    this.replaceList = this.optionsList.filter(options => {
      return !options.exclude
    })
  }

  apply(compiler: Compiler) {
    if (!this.optionsList || !this.optionsList.length) return
    compiler.hooks.normalModuleFactory.tap('SSRExcludeModulePlugin', normalModuleFactory => {
      normalModuleFactory.hooks.beforeResolve.tap('SSRExcludeModulePlugin', resolveData => {
        for (let index = 0; index < this.optionsList.length; index++) {
          const opt = this.optionsList[index]
          const callback = () => {
            if (opt.exclude) {
              if (this.isDebug)
                console.log('[SSRExcludeModulePlugin][beforeResolve]', opt.module, resolveData.request, 'exclude')
              return false
            }
            if (this.isDebug)
              console.log('[SSRExcludeModulePlugin][beforeResolve]', opt.module, resolveData.request, opt.replace)
            resolveData.request = opt.replace
          }
          if (typeof opt.module === 'string') {
            if (resolveData.request.includes(opt.module)) return callback()
          } else if (opt.module.test(resolveData.request)) {
            return callback()
          }
        }
      })
      if (this.replaceList.length) {
        normalModuleFactory.hooks.afterResolve.tap('SSRExcludeModulePlugin', resolveData => {
          const createData = resolveData.createData
          if (!createData) return
          for (let index = 0; index < this.replaceList.length; index++) {
            const options = this.replaceList[index]
            const callback = () => {
              const newResource = options.replace
              const fs = compiler.inputFileSystem
              if (newResource.startsWith('/') || (newResource.length > 1 && newResource[1] === ':')) {
                createData.resource = newResource
              } else {
                createData.resource = join(fs, dirname(fs, createData.resource), newResource)
              }
              if (this.isDebug)
                console.log('[SSRExcludeModulePlugin][afterResolve]', options.module, options.replace, newResource)
            }
            if (typeof options.module === 'string') {
              if (createData.resource.includes(options.module)) return callback()
            } else if (options.module.test(createData.resource)) {
              return callback()
            }
          }
        })
      }
    })
  }
}
