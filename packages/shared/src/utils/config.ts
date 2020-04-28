import { Args } from '@types'
import { TSetting } from '@web-steps/config'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { merge } from './lodash'

export function getEnv(payload: { env: string }) {
  return payload.env !== 'development' ? 'production' : 'development'
}

/**
 * 是否启用缓存
 * - 默认 启用
 */
export function getCache(_this: Args): boolean {
  const args = _this.args
  if (args.cache === true) return true
  let cache = _this.env !== 'production'
  args.cache = (args.cache || '').toLowerCase()
  if (args.cache === 'false') cache = false
  else if (args.cache === 'true') cache = true
  return cache
}

const defaultSetting: TSetting = {
  entry: 'web-steps.ts',
  output: 'dist/web-steps',
  cache: 'node_modules/.web-steps_cache'
}

export function getResolve(a: { rootDir: string }) {
  return function(...args: string[]): string {
    return path.resolve.apply(undefined, [a.rootDir, ...args])
  }
}

/**
 * 获取配置文件
 */
export function getSetting(args: Args, resolve?: (...args: string[]) => string) {
  resolve = resolve || getResolve(args)
  const settingPath = resolve(args.settingPath)
  let setting: TSetting = defaultSetting
  if (existsSync(settingPath)) {
    const jsonString = readFileSync(settingPath, { encoding: 'utf-8' })
    setting = merge({}, defaultSetting, JSON.parse(jsonString))
  }
  return Object.keys(setting).reduce(
    (configFile, key: keyof TSetting) => {
      const path = setting[key] || defaultSetting[key]
      if (path) {
        configFile[key] = resolve(path)
      }
      return configFile
    },
    {} as TSetting
  )
  // console.log('[getSetting]', this.setting)
}
