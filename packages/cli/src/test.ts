import { catchError } from './utils/error'
import { getProcessMessageMap } from 'packages/shared'

async function main() {
  await getProcessMessageMap()
}

main().catch(err => catchError(err))
