import { Args } from '@types'
import { catchError } from './utils/error'

export function start(args: Args) {
  async function main() {
    console.log(args)
  }
  main().catch(err => catchError(err))
}
