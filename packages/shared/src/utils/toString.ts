export function convertObjToSource(obj: any) {
  let sourceString = ''
  if (obj instanceof Array) {
    sourceString = `[${obj.map(i => convertObjToSource(i)).join(',')}]`
  } else if (typeof obj === 'string') {
    sourceString = JSON.stringify(obj)
  } else if (!obj) {
    return '' + obj
  } else {
    sourceString = obj.toString()
  }

  if (sourceString === 'function () { [native code] }') {
    return 'undefined'
  } else if (sourceString === '[object Object]') {
    sourceString = '{'
    for (let k in obj) {
      if (!obj.hasOwnProperty(k)) continue
      sourceString += `\n  "${k}": ${convertObjToSource(obj[k])},`
    }
    sourceString += '\n}'
  }
  return sourceString
}
