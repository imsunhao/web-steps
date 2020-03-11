import { getOptions } from 'loader-utils'
import { parseSync, stringify } from 'svgson'

function arrayRemove(array: any[], index: number) {
  if (index > -1) {
    array.splice(index, 1)
  }
}

function remove(a: any[]) {
  let index = 0
  while (index !== -1) {
    index = a.findIndex(({ remove }) => remove)
    arrayRemove(a, index)
  }
  return a
}

export default function(this: any, source: any) {
  const options = getOptions(this)
  function fixSvg(result: any) {
    if (!result.attributes.width && result.attributes.viewBox) {
      const viewBox = result.attributes.viewBox.split(' ')
      result.attributes.width = viewBox[2]
      result.attributes.height = viewBox[3]
    }
    if (options.customViewBox) result.attributes.viewBox = options.customViewBox
    delete result.attributes.style
    delete result.attributes['xml:space']

    if (result.children[0].name === 'path') {
      return result.children
    } else {
      while (result.children[0] && result.children[0].name !== 'g') {
        result.children.shift()
      }
      result.children = [result.children[0]]
    }
    return result.children[0].children
  }

  function getEqual(maxWidth: number, maxHeight: number) {
    return function(b: { [x: string]: any }, a: { [x: string]: any }) {
      let result = true
      Object.keys(a).forEach(key => {
        if (a[key] === 'max-width') {
          a[key] = maxWidth
        } else if (a[key] === 'max-height') {
          a[key] = maxHeight
        }

        if (result && a[key] != b[key]) {
          result = false
        }
      })
      return result
    }
  }

  try {
    const result = parseSync(source)

    const resultChildren = fixSvg(result)

    const maxWidth = result.attributes.width
    const maxHeight = result.attributes.height

    const equal = getEqual(maxWidth, maxHeight)

    if (options.remove) {
      options.remove.forEach(({ element, attribute: attributesOption }: any) => {
        // console.log('element =', element)
        // console.log('attributesOption =', attributesOption)
        if (element) {
          element.forEach((key: any) => {
            resultChildren.forEach(({ name, attributes }: any, index: string | number) => {
              if (name === key) {
                if (attributesOption) {
                  if (equal(attributes, attributesOption)) {
                    resultChildren[index].remove = true
                  }
                } else {
                  resultChildren[index].remove = true
                }
              }
            })
            remove(resultChildren)
          })
        } else if (attributesOption) {
          resultChildren.forEach(({ children }: any, index: string | number) => {
            attributesOption.forEach((attribute: string | number) => {
              // console.log(
              //   'resultChildren[index][attribute]',
              //   resultChildren[index].attributes[attribute],
              //   attribute
              // )
              delete resultChildren[index].attributes[attribute]
            })
          })
        }
      })
    }

    // console.dir(resultChildren)

    return `export default \`${stringify(result)}\``
  } catch (error) {
    // console.error('[@bestminr/svg-icon-webpack-loader] ERROR: source is not a svg', error)
    return source
  }
}
