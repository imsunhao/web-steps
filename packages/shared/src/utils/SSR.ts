export function getHostGlobal() {
  let hostGlobal: any
  try {
    hostGlobal = window
    if (!hostGlobal) throw new Error('window is undefined')
  } catch (e) {
    try {
      hostGlobal = process
      if (!hostGlobal) throw new Error('process is undefined')
    } catch (e) {
      hostGlobal = global
    }
  }
  return hostGlobal
}
