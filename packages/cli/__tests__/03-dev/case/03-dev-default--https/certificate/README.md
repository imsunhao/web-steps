## mac 系统

```cmd
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certificate/CA.pem
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certificate/web-steps.crt
open /Library/Keychains/System.keychain
```

然后 找到 标红的 web-steps 证书, 双击打开 找到 详细. 始终信任
