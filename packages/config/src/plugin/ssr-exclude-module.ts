import { TSSRExcludeModuleOptions, TExcludeModuleOption } from '../type'
import { Compiler } from 'webpack'
import { join, dirname } from 'packages/shared'

export class SSRExcludeModulePlugin {
  options: TSSRExcludeModuleOptions

  replaceList: Array<{
    module: TExcludeModuleOption
    replace: string
  }>

  constructor(options: TSSRExcludeModuleOptions) {
    this.options = options
    this.options.debug = true
    this.replaceList = this.options.list.filter(opt => {
      if (typeof opt === 'string') return false
      if ('module' in opt && opt.replace) return true
    }) as any
  }

  returnFalseFunc(...args: any[]) {
    if (this.options.debug) console.log.apply(undefined, args)
    return false
  }

  apply(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap('SSRExcludeModulePlugin', normalModuleFactory => {
      normalModuleFactory.hooks.beforeResolve.tap('SSRExcludeModulePlugin', resolveData => {
        for (let index = 0; index < this.options.list.length; index++) {
          const opt = this.options.list[index]
          if (typeof opt === 'string') {
            if (resolveData.request.includes(opt)) return this.returnFalseFunc(resolveData.request, opt)
          } else if ('module' in opt) {
            const callback = () => {
              if (!opt.replace) return this.returnFalseFunc(resolveData.request, opt.module)
              resolveData.request = opt.replace
            }
            if (typeof opt.module === 'string') {
              if (resolveData.request.includes(opt.module)) return callback()
            } else if (opt.module.test(resolveData.request)) {
              return callback()
            }
          } else if (opt.test(resolveData.request)) return this.returnFalseFunc(resolveData.request, opt)
        }
      })
      if (this.replaceList.length) {
        normalModuleFactory.hooks.afterResolve.tap('SSRExcludeModulePlugin', resolveData => {
          const createData = resolveData.createData
          if (!createData) return
          else debugger
          for (let index = 0; index < this.replaceList.length; index++) {
            const opt = this.replaceList[index]
            const callback = () => {
              debugger
              const newResource = opt.replace
              const fs = compiler.inputFileSystem
              if (newResource.startsWith('/') || (newResource.length > 1 && newResource[1] === ':')) {
                createData.resource = newResource
              } else {
                createData.resource = join(fs, dirname(fs, createData.resource), newResource)
              }
              if (this.options.debug) console.log(opt.module, opt.replace, newResource)
            }
            if (typeof opt.module === 'string') {
              if (createData.resource.includes(opt.module)) return callback()
            } else if (opt.module.test(createData.resource)) {
              return callback()
            }
          }
        })
      }
    })
  }
}
