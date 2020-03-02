import { createUUID } from './uuid'
export class MessageBus<T extends Record<string, any>> {
  private map = new Map<keyof T, any[]>()

  on<K extends keyof T>(key: K, fn: T[K]) {
    if (!this.map.has(key)) {
      this.map.set(key, [fn])
    } else {
      const list = this.map.get(key)
      list.push(fn)
    }
    fn.MESSAGE_BUS_ID = createUUID()
  }

  off<K extends keyof T>(key: K, fn: T[K]) {
    const id = fn.MESSAGE_BUS_ID
    if (!id) return
    if (this.map.has(key)) {
      const list = this.map.get(key)
      const pos = list.findIndex(f => f.MESSAGE_BUS_ID === id)
      if (pos !== -1) {
        list.splice(id, 1)
      }
    }
  }

  emit<K extends keyof T, P extends T[K] extends (payload: infer PL) => any ? PL : unknown>(key: K, payload: P) {
    if (this.map.has(key)) {
      const list = this.map.get(key)
      list.forEach(fn => {
        fn(payload)
      })
    }
  }

  clear() {
    this.map = new Map<keyof T, any[]>()
  }
}
