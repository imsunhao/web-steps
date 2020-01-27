export function getError(message: string) {
  return new Error('[@web-steps/config] ' + message)
}

export function catchError(error: Error) {
  console.error(error)
  process.exit(1)
}
