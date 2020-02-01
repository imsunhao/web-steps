import { readdirSync } from 'fs'
import { resolve } from 'path'
import { testing } from '../utils'

const caseDir = resolve(__dirname, 'case')
const major = 'config'

describe(major, () => {
  readdirSync(caseDir).forEach(caseName => {
    testing(major, caseName, require(`./case/${caseName}/test-confg`).default)
  })
})
