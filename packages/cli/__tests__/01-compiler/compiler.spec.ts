import { readdirSync, existsSync, unlinkSync } from 'fs'
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

    if (result.output) {
      for (let i = 0; i < result.output.length; i++) {
        const { filePath } = result.output[i]
        if (existsSync(filePath)) unlinkSync(filePath)
      }
    }

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
          const { messageKey, payload } = message
          switch (messageKey) {
            case 'output':
              if (result.output) {
                for (let i = 0; i < result.output.length; i++) {
                  const { filePath, name } = result.output[i]
                  if (payload.name === name) {
                    expect(existsSync(filePath)).toBeTruthy()
                    resultSet.add(messageKey)
                  }
                }
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
          expect(resultSet.size).toEqual(Object.keys(result).length)
          done()
        })
      },
      30000
    )
  })
})

type TOutput = {
  name: string
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
    cache?: string
  }
  close?: boolean
}
