import { readdirSync } from 'fs'
import { resolve } from 'path'
import { testing } from '../utils'

const caseDir = resolve(__dirname, 'case')
const major = 'start'

describe(major, () => {
  readdirSync(caseDir).forEach(caseName => {
    if (caseName === '.DS_Store') return
    testing(major, caseName, require(`./case/${caseName}/test-confg`).default)
  })
})
