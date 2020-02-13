import { TRemoveCodeBlockOptions } from '@web-steps/helper'
import loaderUtils from 'loader-utils'
/**
 * 移除 指定环境 下 代码块
 * - 测试目录: packages/cli/__tests__/01-compiler/case/05-prod-remove-code-block
 * @param this webpack loader
 * @param content source
 */
export default function(this: any, content: string) {
  const options: TRemoveCodeBlockOptions = loaderUtils.getOptions(this) || ({} as any)
  if (!options.VUE_ENV) throw '[remove-code-block] options.VUE_ENV is undefined'

  const commentList = [options.VUE_ENV, options.NODE_ENV || this.mode]
  const replace = (comment: string) => {
    const regexPattern = new RegExp(
      '[\\t ]*\\/\\/\\/ ?<RemoveCodeBlock=' + comment + '>[\\s\\S]*\\/\\/\\/ ?<\\/RemoveCodeBlock=' + comment + '>.*',
      'g'
    )

    content = content.replace(regexPattern, '')
  }
  commentList.forEach(comment => {
    replace('.*' + comment)
    replace(comment + '.*')
  })

  if (this.cacheable) {
    this.cacheable(true)
  }

  return content
}
