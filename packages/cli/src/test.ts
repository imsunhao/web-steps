import { catchError } from './utils/error'
import { getMessageMap } from './utils/message'

async function main() {
  await getMessageMap()
}

main().catch(err => catchError(err))
