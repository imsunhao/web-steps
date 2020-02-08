import minimist from 'minimist'
import { existsSync, unlinkSync } from 'fs'
import execa from 'execa'
import { Execa } from '../../src/utils/node'
import { ProcessMessage } from '@types'
import { setupPuppeteer } from './e2eUtils'
import { requireFromPath } from '@web-steps/shared'

type TOutput = {
  name: string
  filePath: string
}

export type TTestConfig = {
  /**
   * 超时时间
   * - 默认 10000ms
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
    config?: any
    export_config?: {
      path: string
      result: any
    }
    output?: TOutput[]
    cache?: string
    e2e?: {
      debug?: boolean
      url: string
      texts?: Record<string, string>
    }
  }
  close?: boolean
}

export function testing(major: string, caseName: string, testConfig: TTestConfig) {
  const {
    vscodeDebug,
    timeout,
    skip,
    todo,
    node,
    node: { target, argv, rootDir },
    webSteps,
    result,
    close
  } = testConfig
  const env = node.env || 'production'
  const cache = typeof testConfig.cache !== 'undefined' ? testConfig.cache : true
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
            !cache ? `--cache=${cache}` : '',
            webSteps ? `--target=${webSteps.target}` : '',
            `--env=${env}`
          ]
          break
        case 'web-steps--compiler':
          nodeArgv = [`packages/compiler/bin/web-steps--compiler`, `--env=${env}`]
        default:
          break
      }

      nodeArgv = nodeArgv.concat(argv || [])

      const childProcess = Execa.runNodeIPC(nodeArgv, { isSilence: !args.show, isRead: args.read })
      if (!childProcess.on) return done()

      const resultSet = new Set<string>()

      childProcess.on('message', async (message: ProcessMessage) => {
        const { messageKey } = message
        if (args.show) console.log('[单元测试] messageKey', messageKey)
        if (await resolveMessageKey(message, result, childProcess, args)) {
          resultSet.add(messageKey)
        }
      })

      childProcess.on('close', code => {
        if (close) {
          expect(code).toEqual(0)
        }
        expect(resultSet.size).toEqual(Object.keys(result).length)
        done()
      })
    },
    __DEBUG_PORT__ ? 6000000 : timeout || 10000
  )
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

  if (!!result[msg]) {
    switch (msg) {
      case 'config': {
        expect(payload).toMatchObject(result.config)
        return true
      }
      case 'export_config': {
        const { path: exportPath, result: epxortResult } = result.export_config
        expect(existsSync(exportPath)).toBeTruthy()
        expect(requireFromPath(exportPath)).toMatchObject(epxortResult)
        return true
      }
      case 'cache': {
        expect(existsSync(result.cache)).toBeTruthy()
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
      case 'e2e':
        try {
          const { url, texts, debug: e2eDebug } = result.e2e
          if (e2eDebug) {
            if (args.show) {
              console.log('[e2e] url =', url)
            }
            if (__DEBUG_PORT__) debugger
            else return true
          }
          const { page, text, destroy } = await setupPuppeteer()
          if (texts) {
            await page.goto(url, { timeout: 5000 })
            const textKeys = Object.keys(texts)
            for (let i = 0; i < textKeys.length; i++) {
              const key = textKeys[i]
              const result = await text(key)
              if (args.show) console.log(`[单元测试] e2e: text key = "${key}", result = "${result}"`)
              expect(result).toBe(texts[key])
            }
          }
          await destroy()
          childProcess.send({ messageKey: 'e2e' })
          return true
        } catch (e) {
          return false
        }
        break
      default:
        break
    }
  }
  return false
}
