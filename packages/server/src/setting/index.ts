import { defaultTemplatePath } from '@web-steps/config'
import { requireFromPath } from 'packages/shared'
/**
 * 默认 启动端口
 */
export const DEFAULT_PORT = 8080

export const DEFAULT_TEMPLATE = requireFromPath(defaultTemplatePath)
