export function getHostGlobal() {
  let hostGlobal: any
  try {
    hostGlobal = window
  } catch (e) {
    hostGlobal = process
  }
  return hostGlobal
}
