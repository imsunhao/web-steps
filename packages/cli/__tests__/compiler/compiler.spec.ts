import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import { Run } from '../../src'
import { ProcessMessage } from '@types'

const caseDir = resolve(__dirname, 'case')

export type TestConfig = {
  skip: boolean
  node: {
    target: 'web-steps' | 'web-steps--compiler'
    env?: 'production' | 'development'
    argv?: string[]
  }
  result: {
    output?: {
      filePath: string
    }
  }
  close?: boolean
}

const run = new Run()

describe('compiler', () => {
  const cases = readdirSync(caseDir)

  cases.forEach(caseName => {
    const {
      skip,
      node,
      node: { target, argv },
      result,
      close
    }: TestConfig = require(`./case/${caseName}/test-confg`).default
    const env = node.env || 'development'
    if (skip) return test.todo(caseName)
    test(
      caseName,
      done => {
        const nodeArgv = (target === 'web-steps'
          ? [
              'packages/cli/bin/web-steps',
              'compiler',
              `--root-dir=${resolve(__dirname, 'case', caseName)}`,
              `--target=SSR${env ? '-' + env : ''}`
            ]
          : [`packages/compiler/dist/compiler-${env}`]
        ).concat(argv || [])

        const childProcess = run.runNodeIPC(nodeArgv, { isSilence: true, isRead: false })

        childProcess.on('message', (message: ProcessMessage) => {
          const { name } = message
          // console.log('[父亲]', name)
          switch (name) {
            case 'output':
              if (result.output) {
                const { filePath } = result.output
                expect(existsSync(filePath)).toBeTruthy()
              }
              break
            default:
              break
          }
        })

        childProcess.on('close', code => {
          if (close) {
            expect(code).toEqual(0)
          }
          done()
        })
      },
      30000
    )
  })
})
