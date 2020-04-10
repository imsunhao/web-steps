import minimist from 'minimist'
import { existsSync, unlinkSync } from 'fs'
import execa from 'execa'
import { Execa } from '../../src/utils/node'
import { ProcessMessage } from '@types'
import { setupPuppeteer } from './e2eUtils'
import { requireFromPath } from 'shared/require'
import { ClickOptions, Page } from 'puppeteer-core'

type TOutput = {
  name: string
  filePath: string
}

export type TTestConfig = {
  /**
   * 超时时间
   * - 默认 15000ms
   */
  timeout?: number
  vscodeDebug?: boolean
  skip?: boolean
  todo?: boolean
  /**
   * 是否启用缓存
   * - 默认启用
   */
  cache?: boolean
  node: {
    target: 'web-steps' | 'web-steps--compiler'
    rootDir: string
    env?: 'production' | 'development'
    argv?: string[]
  }
  webSteps?: {
    target: 'SSR' | 'SSR-client' | 'SSR-server' | 'custom'
  }
  result: {
    build?: {
      filesManifest?: {
        path: string
        content: any
      }
    }
    config?: any
    EXPORT_CONFIG?: {
      path: string
      result: any
    }
    output?: TOutput[]
    cache?: Record<string, string>
    e2e?: {
      debug?: boolean
      url: string
      texts?: Record<string, string>
      action?: (
        opts: {
          text: any
          click: (selector: string, options?: ClickOptions) => Promise<void>
          page: Page
          show: boolean
        }
      ) => Promise<any>
    }
  }
  close?: boolean
}

async function resolveMessageKey(
  message: ProcessMessage,
  r: TTestConfig['result'],
  childProcess: execa.ExecaChildProcess<string>,
  args: any
) {
  const { messageKey, payload } = message
  const msg: keyof TTestConfig['result'] = messageKey as any
  const result: Required<TTestConfig['result']> = r as any

  if (result[msg]) {
    switch (msg) {
      case 'config': {
        expect(payload).toMatchObject(result.config)
        return true
      }
      case 'EXPORT_CONFIG': {
        const { path: exportPath, result: epxortResult } = result.EXPORT_CONFIG
        expect(existsSync(exportPath)).toBeTruthy()
        expect(requireFromPath(exportPath)).toMatchObject(epxortResult)
        return true
      }
      case 'cache': {
        if (!result.cache[payload]) return true
        expect(existsSync(result.cache[payload])).toBeTruthy()
        return true
      }
      case 'output':
        for (let i = 0; i < result.output.length; i++) {
          const { filePath, name } = result.output[i]
          if (payload.name === name) {
            expect(existsSync(filePath)).toBeTruthy()
            return true
          }
        }
        break
      case 'build':
        const filesManifest = result.build.filesManifest
        if (filesManifest) {
          expect(existsSync(filesManifest.path)).toBeTruthy()
          expect(requireFromPath(filesManifest.path)).toMatchObject(filesManifest.content)
        }
        childProcess.send({ messageKey: 'exit' })
        return true
      case 'e2e':
        const { url, texts, debug: e2eDebug, action } = result.e2e
        if (e2eDebug && __DEBUG_PORT__) {
          if (args.show) {
            console.log('[e2e] url =', url)
          }
          if (__DEBUG_PORT__) debugger
          else return true
        }
        if (args.show) console.log('setupPuppeteer start!')
        const { page, text, click, destroy } = await setupPuppeteer()
        try {
          if (texts) {
            if (args.show) console.log('page.goto')
            await page.goto(url, { timeout: 5000 })
            const textKeys = Object.keys(texts)
            for (let i = 0; i < textKeys.length; i++) {
              const key = textKeys[i]
              const result = await text(key)
              if (args.show) console.log(`[单元测试] e2e: text key = "${key}", result = "${result}"`)
              expect(result).toBe(texts[key])
            }
          }
          if (action) await action({ text, click, page, show: args.show })
          if (args.show) console.log('[Puppeteer] destroy')
          await destroy()
          childProcess.send({ messageKey: 'e2e' })
          return true
        } catch (e) {
          console.error(e)
          if (args.show) console.log('[Puppeteer] destroy')
          await destroy()
          childProcess.send({ messageKey: 'e2e' })
          return false
        }
      default:
        break
    }
  }
  return false
}

export function testing(major: string, caseName: string, testConfig: TTestConfig) {
  const {
    vscodeDebug,
    timeout,
    skip,
    todo,
    node,
    node: { target, argv, rootDir },
    cache,
    webSteps,
    result,
    close
  } = testConfig
  const env = node.env || 'production'
  if (todo) return test.todo(caseName)
  if (skip || (process.env.VSCODE && !vscodeDebug)) return test.skip(caseName, () => {})
  if (process.env.VSCODE) debugger
  const args = minimist(process.argv.slice(3), { string: 'case' })
  if (args['case']) {
    if (!new RegExp('^' + args['case']).test(caseName)) {
      return test.skip(caseName, () => {})
    }
  }
  if (result.output) {
    for (let i = 0; i < result.output.length; i++) {
      const { filePath } = result.output[i]
      if (existsSync(filePath)) unlinkSync(filePath)
    }
  }

  test(
    caseName,
    done => {
      let nodeArgv: string[] = []

      switch (target) {
        case 'web-steps':
          nodeArgv = [
            'packages/cli/bin/web-steps',
            major,
            `--root-dir=${rootDir}`,
            `--cache=${cache}`,
            webSteps ? `--target=${webSteps.target}` : '',
            `--env=${env}`
          ]
          break
        case 'web-steps--compiler':
          nodeArgv = [`packages/compiler/bin/web-steps--compiler`, `--env=${env}`]
          break
      }

      nodeArgv = nodeArgv.concat(argv || [])

      const childProcess = Execa.runNodeIPC(nodeArgv, { isSilence: !args.show, isRead: args.read })
      if (!('on' in childProcess)) return done()

      const resultSet = new Set<string>()

      childProcess.on('message', (message: ProcessMessage) => {
        const main = async () => {
          const { messageKey } = message
          if (args.show) console.log('[单元测试] messageKey', messageKey)
          if (await resolveMessageKey(message, result, childProcess, args)) {
            resultSet.add(messageKey)
          }
        }
        main()
      })

      childProcess.on('close', code => {
        if (close) {
          expect(code).toEqual(0)
        }
        expect(resultSet.size).toEqual(Object.keys(result).length)
        done()
      })
    },
    __DEBUG_PORT__ ? 6000000 : timeout || 15000
  )
}
