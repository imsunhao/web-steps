export function getError(message: string) {
  return new Error('[@web-steps/cli] ' + message)
}

export function catchError(error: Error): undefined {
  console.error(error)
  process.exit(1)
}
