import { TServerInjectContext } from '@web-steps/server'
import TerserPlugin from 'terser-webpack-plugin'
/**
 * 默认 启动端口
 */
export const DEFAULT_PORT = 8080

export const DEFAULT_INJECT_CONTEXT: TServerInjectContext = {
  SERVER_HOST: 'http://127.0.0.1:8080'
}

export const DEFAULT_OPENSSL_CONFIG = `
[ req ]
default_bits            = 2048
distinguished_name      = req_distinguished_name
default_md              = sha256
prompt                  = no

[ req_distinguished_name ]
countryName             = CN
stateOrProvinceName     = province
localityName            = locality
organizationName        = web-steps--self-signed
organizationalUnitName  = web-steps
`

export const DEFAULT_V3_EXT_CONFIG = `
authorityKeyIdentifier  = keyid,issuer
basicConstraints        = CA:FALSE
keyUsage                = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName          = @alt_names

[alt_names]
DNS.1                   = localhost
IP.1                    = 127.0.0.1
`

export const HTTPS_README = (ca: string, cert: string) => `
## mac 系统
\`\`\`
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${ca}
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${cert}
open /Library/Keychains/System.keychain
\`\`\`
然后 找到 标红的 web-steps 证书, 双击打开 找到 详细. 始终信任
`

export const TERSER_PLUGIN_OPTIONS: TerserPlugin.TerserPluginOptions = {
  exclude: /\.min\.js$/,
  parallel: true,
  extractComments: false,
  sourceMap: false
}
