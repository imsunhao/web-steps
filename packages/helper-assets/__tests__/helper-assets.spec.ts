import { AssetsHelper } from '../src'

const PUBLIC_ASSETS = {
  home: {
    home: {
      home: {
        home: {
          'home.svg': 'public/home/home.74b183e2d867fc9b68beda2d0c51e3ff.svg'
        }
      }
    }
  },
  'logo.svg': 'public/logo.74b183e2d867fc9b68beda2d0c51e3ff.svg',
  'text.txt': 'public/text.d2f41534ddb1ff3f69d501a2ef76d52a.txt'
}

const STATIC_ASSETS = {
  'favicon.ico': 'static/favicon.7b9e28e2da3abaeb195a7fd58944c23e.ico',
  'static.txt': 'static/static.1165b02742a1240e3c553fdcedfafbe6.txt'
}

describe('assets-helper.spec', () => {
  it('dev', () => {
    const { getPublicAssets, getStaticAssets } = AssetsHelper.makeWrapper(
      { PUBLIC_ASSETS, STATIC_ASSETS, dev: true },
      ''
    )

    expect(getPublicAssets('home', 'home', 'home', 'home', 'home.svg')).toEqual('/public/home/home/home/home/home.svg')
    expect(getStaticAssets('favicon.ico')).toEqual('/static/favicon.ico')
  })

  it('production', () => {
    const { getPublicAssets, getStaticAssets } = AssetsHelper.makeWrapper(
      { PUBLIC_ASSETS, STATIC_ASSETS, dev: false },
      '/'
    )

    expect(getPublicAssets('home', 'home', 'home', 'home', 'home.svg')).toEqual(
      '/' + PUBLIC_ASSETS.home.home.home.home['home.svg']
    )
    expect(getStaticAssets('favicon.ico')).toEqual('/' + STATIC_ASSETS['favicon.ico'])
  })
})
