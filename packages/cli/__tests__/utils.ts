import minimist from 'minimist'
import { existsSync, unlinkSync } from 'fs'
import { Execa } from '../src/utils/node'
import { ProcessMessage } from '@types'

type TOutput = {
  name: string
  filePath: string
}

export type TTestConfig = {
  skip: boolean
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
    output?: TOutput[]
    cache?: string
  }
  close?: boolean
}

export function testing(major: string, caseName: string, testConfig: TTestConfig) {
  const {
    skip,
    node,
    node: { target, argv, rootDir },
    webSteps,
    result,
    close
  } = testConfig
  const env = node.env || 'production'
  const cache = typeof testConfig.cache !== 'undefined' ? testConfig.cache : true
  if (skip) return test.todo(caseName)
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

      childProcess.on('message', (message: ProcessMessage) => {
        const { messageKey } = message
        if (args.show) console.log('[父亲] messageKey', messageKey)
        if (resolveMessageKey(message, result)) {
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
    __DEBUG_PORT__ ? 6000000 : 30000
  )
}

function resolveMessageKey(message: ProcessMessage, r: TTestConfig['result']) {
  const { messageKey, payload } = message
  const msg: keyof TTestConfig['result'] = messageKey as any
  const result: Required<TTestConfig['result']> = r as any

  if (!!result[msg]) {
    switch (msg) {
      case 'config': {
        expect(payload).toMatchObject(result.config)
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
      default:
        break
    }
  }
  return false
}
