export function mergeBase(src: { [x: string]: any }, target: { [x: string]: any }) {
  if (typeof target !== 'object' || typeof src !== 'object') return target
  Object.keys(target).forEach(t => {
    if (typeof target[t] === 'object' && typeof src[t] === 'object') {
      src[t] = mergeBase(src[t], target[t])
    } else {
      src[t] = target[t]
    }
  })
  return src
}

export function cloneDeep<T>(data: T): T {
  if (typeof data !== 'object') return data
  if (data instanceof RegExp) return data
  if (data instanceof Array) {
    return data.map(d => {
      return cloneDeep(d)
    }) as any
  }
  return Object.keys(data).reduce((t: any, o) => {
    t[o] = cloneDeep((data as any)[o])
    return t
  }, {})
}

export function merge(...args: any[]) {
  return args.reduce((t, o) => {
    if (!o) return t
    if (t === o) return t
    return mergeBase(t, cloneDeep(o))
  }, args[0])
}

export function has(obj: any, paths: string[] | string): boolean {
  if (typeof paths === 'string') paths = paths.split('.')
  if (!paths.length) return true
  const path = paths.shift()
  if (typeof obj[path] === 'undefined') return false
  return has(obj[path], paths)
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
export function debounce(func: any, wait?: number, immediate?: any) {
  let timeout: NodeJS.Timeout, args: any, context: any, timestamp: number, result: any
  if (null == wait) wait = 100

  function later() {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }

  const debounced = function(this: any, ...arg: any[]) {
    context = this
    args = arg
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args)
      context = args = null

      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
