import { defaultTemplatePath } from '@web-steps/config'
import { requireFromPath } from 'shared/require'

export const DEFAULT_TEMPLATE = requireFromPath(defaultTemplatePath)