import { PUBLIC_ASSETS, STATIC_ASSETS } from './assets'
import { AssetsHelper } from '@web-steps/helper-assets'

export const { getPublicAssets, getStaticAssets } = AssetsHelper.makeWrapper({ PUBLIC_ASSETS, STATIC_ASSETS })
