import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import { Execa } from '../../src/utils/node'
import { ProcessMessage } from '@types'

const caseDir = resolve(__dirname, 'case')

describe('compiler', () => {
  readdirSync(caseDir).forEach(caseName => {
    const {
      skip,
      node,
      node: { target, argv },
      webSteps,
      result,
      close
    }: TTestConfig = require(`./case/${caseName}/test-confg`).default
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
              webSteps ? `--target=${webSteps.target}` : '',
              `--env=${env}`
            ]
          : [`packages/compiler`, `--env=${env}`]
        ).concat(argv || [])

        const childProcess = Execa.runNodeIPC(nodeArgv, { isSilence: true, isRead: false })
        if (!childProcess.on) return done()

        const resultSet = new Set<string>()

        childProcess.on('message', (message: ProcessMessage) => {
          const { name } = message
          // console.log('[父亲]', name)
          switch (name) {
            case 'output':
              if (result.output) {
                result.output.forEach(({ filePath }) => {
                  expect(existsSync(filePath)).toBeTruthy()
                })
                resultSet.add(name)
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
          expect(Object.keys(result).length).toEqual(resultSet.size)
          done()
        })
      },
      30000
    )
  })
})

type TOutput = {
  filePath: string
}

export type TTestConfig = {
  skip: boolean
  node: {
    target: 'web-steps' | 'web-steps--compiler'
    env?: 'production' | 'development'
    argv?: string[]
  }
  webSteps?: {
    target: 'SSR' | 'SSR-client' | 'SSR-server'
  }
  result: {
    output?: TOutput[]
  }
  close?: boolean
}
