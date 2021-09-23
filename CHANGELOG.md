## [0.2.10](https://gitlab.bestminr.com/bestminr/web-steps/compare/v0.2.0-alpha.0...v0.2.10) (2021-09-23)


### Bug Fixes

* 保证 pre assets 输出顺序 ([1605385](https://gitlab.bestminr.com/bestminr/web-steps/commit/16053854ecab0793f2a63173c7a17f97f8ecc600))
* 不能使用 统一入口, 必须使用多入口方式引用 ([53bd2c6](https://gitlab.bestminr.com/bestminr/web-steps/commit/53bd2c653d250d6b4bed93a506d4b407b167b35c))
* 完善 api 类型增强 ([667face](https://gitlab.bestminr.com/bestminr/web-steps/commit/667face0477bc956812a5fcab3a1ed20b5421aa8))
* 修复 build eslint error ([20dcf79](https://gitlab.bestminr.com/bestminr/web-steps/commit/20dcf794a6361fdc2f0b61f9edea1439b2238f3c))
* 修复 dev 模式下 server.creating 的优先级问题 ([8063210](https://gitlab.bestminr.com/bestminr/web-steps/commit/80632100a5595bf377d585c4e23e77a52788aafc))
* 修复 dev 模式下, StartConfig INJECT_ENV 获取失败 ([4d787b3](https://gitlab.bestminr.com/bestminr/web-steps/commit/4d787b3efee9f69720d5c179bb884150d402914d))
* 修复 getPathWithHost 错误的返回 ([6e617c6](https://gitlab.bestminr.com/bestminr/web-steps/commit/6e617c6fd533f4002184c880bc2a751e539bf163))
* **ts:** 修复 类型检查 ([3b8c1a7](https://gitlab.bestminr.com/bestminr/web-steps/commit/3b8c1a7a23a6afeeeb95628d56056ed20585b82d))
* 修复 helper-assets 类型检查错误 ([c23d637](https://gitlab.bestminr.com/bestminr/web-steps/commit/c23d637e4b844c54dba6ab98566e7a2529a11aca))
* 修复 requrieFromString 中报错问题 ([39b901b](https://gitlab.bestminr.com/bestminr/web-steps/commit/39b901bee645b7cf8c1bf743299c65ad7ff3db28))


### Features

* 拆分类型 防止强覆盖 导致丢失类型 ([541057e](https://gitlab.bestminr.com/bestminr/web-steps/commit/541057e0c252108dfac3281d6af6afa1bb534058))
* 调整 bin命令 ([8a7a069](https://gitlab.bestminr.com/bestminr/web-steps/commit/8a7a069c551e3db6253a6a924cb8d806c4f43c47))
* 添加 确保 DLL配置 正常 测试 ([b43ed5f](https://gitlab.bestminr.com/bestminr/web-steps/commit/b43ed5fcee3a262e886683c357ea690c74f645d0))
* 添加 build docker 模式 ([c415fbf](https://gitlab.bestminr.com/bestminr/web-steps/commit/c415fbfd04b14b8fa99c724c627ef90ad0584b87))
* 添加 INJECT_ENV ([e96d1d3](https://gitlab.bestminr.com/bestminr/web-steps/commit/e96d1d38edde1e26879fb3eccf50b8b51f2fac7c))
* 添加 inspect 包 ([933bec5](https://gitlab.bestminr.com/bestminr/web-steps/commit/933bec57271eb9e676fd034869ca07455c88a27f))
* 添加 submodules tests-source ([b138057](https://gitlab.bestminr.com/bestminr/web-steps/commit/b13805779837e86bbd2b740ebb683fabb615f4b0))
* 添加 typescript 类型拓展解决方案 ([357571d](https://gitlab.bestminr.com/bestminr/web-steps/commit/357571d236a2e61bd2e0e3b01a22056f1afa9889))
* 完成 inspect web-steps 核心 ([68c07df](https://gitlab.bestminr.com/bestminr/web-steps/commit/68c07df4718200f6eeccf6a48e729f4d747ce809))
* 依赖升级 ts -> 3.9.7 ([91a3c99](https://gitlab.bestminr.com/bestminr/web-steps/commit/91a3c995671a9310d82e633eaeed37e5057b56ed))
* 移除 被代替的测试 ([131d32d](https://gitlab.bestminr.com/bestminr/web-steps/commit/131d32d66fe6fef486b07a8ca7de73223f3d16b5))
* AssetsHelper 添加 addHost ([aa1717d](https://gitlab.bestminr.com/bestminr/web-steps/commit/aa1717d64c53791079effe2cb53b8f2e83946f57))
* getHostGlobal 支持 小程序 ([9a2d676](https://gitlab.bestminr.com/bestminr/web-steps/commit/9a2d6765bd2235ef43751d74d41c5bff63263814))
* INJECT_ENV 自动添加 NODE_ENV ([d33c832](https://gitlab.bestminr.com/bestminr/web-steps/commit/d33c8326ab03e6abffc224850be56c35a2148822))
* test 读取默认配置并导出配置 ([1e6fa7d](https://gitlab.bestminr.com/bestminr/web-steps/commit/1e6fa7da4d7fbcfcac3b76201918b94af2880701))
* test 生成配置缓存 ([b95db5c](https://gitlab.bestminr.com/bestminr/web-steps/commit/b95db5cc8e704e10d487b15f2f593a494a3d3485))



## [0.2.9](https://gitlab.bestminr.com/bestminr/web-steps/compare/v0.2.0-alpha.0...v0.2.9) (2021-09-23)


### Bug Fixes

* 保证 pre assets 输出顺序 ([1605385](https://gitlab.bestminr.com/bestminr/web-steps/commit/16053854ecab0793f2a63173c7a17f97f8ecc600))
* 不能使用 统一入口, 必须使用多入口方式引用 ([53bd2c6](https://gitlab.bestminr.com/bestminr/web-steps/commit/53bd2c653d250d6b4bed93a506d4b407b167b35c))
* 完善 api 类型增强 ([667face](https://gitlab.bestminr.com/bestminr/web-steps/commit/667face0477bc956812a5fcab3a1ed20b5421aa8))
* 修复 build eslint error ([20dcf79](https://gitlab.bestminr.com/bestminr/web-steps/commit/20dcf794a6361fdc2f0b61f9edea1439b2238f3c))
* 修复 dev 模式下 server.creating 的优先级问题 ([8063210](https://gitlab.bestminr.com/bestminr/web-steps/commit/80632100a5595bf377d585c4e23e77a52788aafc))
* 修复 dev 模式下, StartConfig INJECT_ENV 获取失败 ([4d787b3](https://gitlab.bestminr.com/bestminr/web-steps/commit/4d787b3efee9f69720d5c179bb884150d402914d))
* 修复 getPathWithHost 错误的返回 ([6e617c6](https://gitlab.bestminr.com/bestminr/web-steps/commit/6e617c6fd533f4002184c880bc2a751e539bf163))
* **ts:** 修复 类型检查 ([3b8c1a7](https://gitlab.bestminr.com/bestminr/web-steps/commit/3b8c1a7a23a6afeeeb95628d56056ed20585b82d))
* 修复 helper-assets 类型检查错误 ([c23d637](https://gitlab.bestminr.com/bestminr/web-steps/commit/c23d637e4b844c54dba6ab98566e7a2529a11aca))
* 修复 requrieFromString 中报错问题 ([39b901b](https://gitlab.bestminr.com/bestminr/web-steps/commit/39b901bee645b7cf8c1bf743299c65ad7ff3db28))


### Features

* 拆分类型 防止强覆盖 导致丢失类型 ([541057e](https://gitlab.bestminr.com/bestminr/web-steps/commit/541057e0c252108dfac3281d6af6afa1bb534058))
* 调整 bin命令 ([8a7a069](https://gitlab.bestminr.com/bestminr/web-steps/commit/8a7a069c551e3db6253a6a924cb8d806c4f43c47))
* 添加 确保 DLL配置 正常 测试 ([b43ed5f](https://gitlab.bestminr.com/bestminr/web-steps/commit/b43ed5fcee3a262e886683c357ea690c74f645d0))
* 添加 build docker 模式 ([c415fbf](https://gitlab.bestminr.com/bestminr/web-steps/commit/c415fbfd04b14b8fa99c724c627ef90ad0584b87))
* 添加 INJECT_ENV ([e96d1d3](https://gitlab.bestminr.com/bestminr/web-steps/commit/e96d1d38edde1e26879fb3eccf50b8b51f2fac7c))
* 添加 inspect 包 ([933bec5](https://gitlab.bestminr.com/bestminr/web-steps/commit/933bec57271eb9e676fd034869ca07455c88a27f))
* 添加 submodules tests-source ([b138057](https://gitlab.bestminr.com/bestminr/web-steps/commit/b13805779837e86bbd2b740ebb683fabb615f4b0))
* 添加 typescript 类型拓展解决方案 ([357571d](https://gitlab.bestminr.com/bestminr/web-steps/commit/357571d236a2e61bd2e0e3b01a22056f1afa9889))
* 完成 inspect web-steps 核心 ([68c07df](https://gitlab.bestminr.com/bestminr/web-steps/commit/68c07df4718200f6eeccf6a48e729f4d747ce809))
* 依赖升级 ts -> 3.9.7 ([91a3c99](https://gitlab.bestminr.com/bestminr/web-steps/commit/91a3c995671a9310d82e633eaeed37e5057b56ed))
* 移除 被代替的测试 ([131d32d](https://gitlab.bestminr.com/bestminr/web-steps/commit/131d32d66fe6fef486b07a8ca7de73223f3d16b5))
* AssetsHelper 添加 addHost ([aa1717d](https://gitlab.bestminr.com/bestminr/web-steps/commit/aa1717d64c53791079effe2cb53b8f2e83946f57))
* getHostGlobal 支持 小程序 ([9a2d676](https://gitlab.bestminr.com/bestminr/web-steps/commit/9a2d6765bd2235ef43751d74d41c5bff63263814))
* INJECT_ENV 自动添加 NODE_ENV ([d33c832](https://gitlab.bestminr.com/bestminr/web-steps/commit/d33c8326ab03e6abffc224850be56c35a2148822))
* test 读取默认配置并导出配置 ([1e6fa7d](https://gitlab.bestminr.com/bestminr/web-steps/commit/1e6fa7da4d7fbcfcac3b76201918b94af2880701))
* test 生成配置缓存 ([b95db5c](https://gitlab.bestminr.com/bestminr/web-steps/commit/b95db5cc8e704e10d487b15f2f593a494a3d3485))



## [0.2.8](https://github.com/imsunhao/utils/compare/v0.2.7...v0.2.8) (2021-03-06)


### Bug Fixes

* 修复 getPathWithHost 错误的返回 ([6e617c6](https://github.com/imsunhao/utils/commit/6e617c6fd533f4002184c880bc2a751e539bf163))


### Features

* INJECT_ENV 自动添加 NODE_ENV ([d33c832](https://github.com/imsunhao/utils/commit/d33c8326ab03e6abffc224850be56c35a2148822))



## [0.2.7](https://github.com/imsunhao/utils/compare/v0.2.6...v0.2.7) (2020-12-27)


### Bug Fixes

* 保证 pre assets 输出顺序 ([1605385](https://github.com/imsunhao/utils/commit/16053854ecab0793f2a63173c7a17f97f8ecc600))


### Features

* 调整 bin命令 ([8a7a069](https://github.com/imsunhao/utils/commit/8a7a069c551e3db6253a6a924cb8d806c4f43c47))



## [0.2.6](https://github.com/imsunhao/utils/compare/v0.2.5...v0.2.6) (2020-12-01)


### Bug Fixes

* 修复 build eslint error ([20dcf79](https://github.com/imsunhao/utils/commit/20dcf794a6361fdc2f0b61f9edea1439b2238f3c))
* 修复 dev 模式下, StartConfig INJECT_ENV 获取失败 ([4d787b3](https://github.com/imsunhao/utils/commit/4d787b3efee9f69720d5c179bb884150d402914d))



## [0.2.5](https://github.com/imsunhao/utils/compare/v0.2.4...v0.2.5) (2020-11-30)


### Bug Fixes

* **ts:** 修复 类型检查 ([3b8c1a7](https://github.com/imsunhao/utils/commit/3b8c1a7a23a6afeeeb95628d56056ed20585b82d))


### Features

* 添加 INJECT_ENV ([e96d1d3](https://github.com/imsunhao/utils/commit/e96d1d38edde1e26879fb3eccf50b8b51f2fac7c))



## [0.2.4](https://github.com/imsunhao/utils/compare/v0.2.3...v0.2.4) (2020-10-23)


### Features

* getHostGlobal 支持 小程序 ([9a2d676](https://github.com/imsunhao/utils/commit/9a2d6765bd2235ef43751d74d41c5bff63263814))



## [0.2.3](https://github.com/imsunhao/utils/compare/v0.2.2...v0.2.3) (2020-10-22)


### Features

* AssetsHelper 添加 addHost ([aa1717d](https://github.com/imsunhao/utils/commit/aa1717d64c53791079effe2cb53b8f2e83946f57))



## [0.2.2](https://github.com/imsunhao/utils/compare/v0.2.1...v0.2.2) (2020-10-21)


### Bug Fixes

* 修复 helper-assets 类型检查错误 ([c23d637](https://github.com/imsunhao/utils/commit/c23d637e4b844c54dba6ab98566e7a2529a11aca))



## [0.2.1](https://github.com/imsunhao/web-steps/compare/v0.2.1-alpha.0...v0.2.1) (2020-10-06)


### Bug Fixes

* 修复 requrieFromString 中报错问题 ([39b901b](https://github.com/imsunhao/web-steps/commit/39b901bee645b7cf8c1bf743299c65ad7ff3db28))


### Features

* test 生成配置缓存 ([b95db5c](https://github.com/imsunhao/web-steps/commit/b95db5cc8e704e10d487b15f2f593a494a3d3485))
* test 读取默认配置并导出配置 ([1e6fa7d](https://github.com/imsunhao/web-steps/commit/1e6fa7da4d7fbcfcac3b76201918b94af2880701))
* 依赖升级 ts -> 3.9.7 ([91a3c99](https://github.com/imsunhao/web-steps/commit/91a3c995671a9310d82e633eaeed37e5057b56ed))
* 完成 inspect web-steps 核心 ([68c07df](https://github.com/imsunhao/web-steps/commit/68c07df4718200f6eeccf6a48e729f4d747ce809))
* 添加 inspect 包 ([933bec5](https://github.com/imsunhao/web-steps/commit/933bec57271eb9e676fd034869ca07455c88a27f))
* 添加 submodules tests-source ([b138057](https://github.com/imsunhao/web-steps/commit/b13805779837e86bbd2b740ebb683fabb615f4b0))
* 添加 确保 DLL配置 正常 测试 ([b43ed5f](https://github.com/imsunhao/web-steps/commit/b43ed5fcee3a262e886683c357ea690c74f645d0))
* 移除 被代替的测试 ([131d32d](https://github.com/imsunhao/web-steps/commit/131d32d66fe6fef486b07a8ca7de73223f3d16b5))



## [0.2.1-alpha.0](https://github.com/imsunhao/utils/compare/v0.2.0-alpha.4...v0.2.1-alpha.0) (2020-06-16)


### Features

* 添加 build docker 模式 ([c415fbf](https://github.com/imsunhao/utils/commit/c415fbfd04b14b8fa99c724c627ef90ad0584b87))



# [0.2.0-alpha.4](https://github.com/imsunhao/utils/compare/v0.2.0-alpha.3...v0.2.0-alpha.4) (2020-06-04)


### Bug Fixes

* 不能使用 统一入口, 必须使用多入口方式引用 ([53bd2c6](https://github.com/imsunhao/utils/commit/53bd2c653d250d6b4bed93a506d4b407b167b35c))



# [0.2.0-alpha.3](https://github.com/imsunhao/utils/compare/v0.2.0-alpha.2...v0.2.0-alpha.3) (2020-06-04)


### Features

* 拆分类型 防止强覆盖 导致丢失类型 ([541057e](https://github.com/imsunhao/utils/commit/541057e0c252108dfac3281d6af6afa1bb534058))



# [0.2.0-alpha.2](https://github.com/imsunhao/utils/compare/v0.2.0-alpha.1...v0.2.0-alpha.2) (2020-06-04)


### Features

* 添加 typescript 类型拓展解决方案 ([357571d](https://github.com/imsunhao/utils/commit/357571d236a2e61bd2e0e3b01a22056f1afa9889))



# [0.2.0-alpha.1](https://github.com/imsunhao/utils/compare/v0.2.0-alpha.0...v0.2.0-alpha.1) (2020-06-04)


### Bug Fixes

* 完善 api 类型增强 ([667face](https://github.com/imsunhao/utils/commit/667face0477bc956812a5fcab3a1ed20b5421aa8))



# [0.2.0-alpha.0](https://github.com/imsunhao/utils/compare/v0.1.10...v0.2.0-alpha.0) (2020-06-03)


### Bug Fixes

* 保证 getHookFromComponent 传入参数 ([b17da11](https://github.com/imsunhao/utils/commit/b17da1109646d65545cde455ab929edbe6631e2c))


### Features

* 升级依赖 ([befb370](https://github.com/imsunhao/utils/commit/befb370bb2d7e029f9bf6cc2969c4574d871bf98))
* 拆分 helper ([85218af](https://github.com/imsunhao/utils/commit/85218af67b7a8abdb920c34fec3e141c16bb2f1a))
* 拆分 relase -> release -helper ([4cca1b8](https://github.com/imsunhao/utils/commit/4cca1b8d210382f721d90ad8a0ccb374259cfd30))
* 添加 helper-api ([02f255d](https://github.com/imsunhao/utils/commit/02f255d0a3c9e30118430f56d7f492566c665f18))
* 调整 test ([519f3bc](https://github.com/imsunhao/utils/commit/519f3bc056e2eab209c8e4f36c282e389d752e74))



## [0.1.10](https://github.com/imsunhao/utils/compare/v0.1.9...v0.1.10) (2020-05-20)


### Features

* 添加 DingDingRobot ([32bc020](https://github.com/imsunhao/utils/commit/32bc0203ed56b77fc76e80b9a175ee4b8c299aac))



## [0.1.9](https://github.com/imsunhao/utils/compare/v0.1.8...v0.1.9) (2020-05-16)


### Bug Fixes

* hot-reload 初始化中间件 [2df228e] ([685cd47](https://github.com/imsunhao/utils/commit/685cd4751b41eef792eefb6cf492dc2a213e8c08))



## [0.1.8](https://github.com/imsunhao/utils/compare/v0.1.7...v0.1.8) (2020-05-16)


### Bug Fixes

* hot-reload 初始化中间件 bug ([2df228e](https://github.com/imsunhao/utils/commit/2df228efe16e6392b03d5d30265f805efe85b6b0))


### Features

* server listening 更加醒目 ([757a5c0](https://github.com/imsunhao/utils/commit/757a5c045b81170937b558051c7828db46563873))



## [0.1.7](https://github.com/imsunhao/utils/compare/v0.1.6...v0.1.7) (2020-05-15)


### Bug Fixes

* 修复 Args port ([189d82e](https://github.com/imsunhao/utils/commit/189d82eda9df2d23c77fd2d5e6b93b1ef8e84a4d))



## [0.1.6](https://github.com/imsunhao/utils/compare/v0.1.5...v0.1.6) (2020-05-12)


### Features

* 拓展 DLL performance ([1034e73](https://github.com/imsunhao/utils/commit/1034e732f492acbd484efa8a8ffef1bdca5e89f1))



## [0.1.5](https://github.com/imsunhao/utils/compare/v0.1.4...v0.1.5) (2020-05-11)



## [0.1.4](https://github.com/imsunhao/utils/compare/v0.1.3...v0.1.4) (2020-05-10)


### Bug Fixes

* 修复 isHotReload 初始化值 错误的问题 2 ([55b1bde](https://github.com/imsunhao/utils/commit/55b1bde551e2b82c9f649bf16e326f58d5cac069))


### Features

* 添加 unpublish 脚本 ([935b413](https://github.com/imsunhao/utils/commit/935b41328bb3e5d67a6bd5318e1f3b22d7627c08))


### Reverts

* Revert "feat: server-life-cycle 添加 TServerStartOptions 支持" ([ce7684d](https://github.com/imsunhao/utils/commit/ce7684d94bdd2386f8c70b72d4165490c55234ab))
* Revert "fix: 修复 isHotReload 初始化值 错误的问题" ([bb64785](https://github.com/imsunhao/utils/commit/bb647856eb973e74a0d82e7e4ff016c1f3155a6a))
* v0.1.3 ([ae5cfd2](https://github.com/imsunhao/utils/commit/ae5cfd237693a24a4bc44c53fd30bcf35a7d8eda))



## [0.1.3](https://github.com/imsunhao/utils/compare/v0.1.2...v0.1.3) (2020-05-10)


### Bug Fixes

* 修复 isHotReload 初始化值 错误的问题 ([ae9eeef](https://github.com/imsunhao/utils/commit/ae9eeef99507405e15dd95d38e14d67064aa28ef))


### Features

* 调整 release 命令,  参数统一 ([3c84e75](https://github.com/imsunhao/utils/commit/3c84e757a33eacae6dce7c8ca210ef180124df7e))



## [0.1.2](https://github.com/imsunhao/utils/compare/v0.1.1...v0.1.2) (2020-05-10)


### Bug Fixes

* 修复 测试错误 ([154fd3a](https://github.com/imsunhao/utils/commit/154fd3ae5a16151426a43e182937e37c77e8e2cb))


### Features

* [compiler] 移除 dependencies ([32b1f7e](https://github.com/imsunhao/utils/commit/32b1f7ebc3e4e9e4d1939773f2e089f996fbc0dc))
* server-life-cycle 添加 TServerStartOptions 支持 ([7178a5a](https://github.com/imsunhao/utils/commit/7178a5a3a6e44c30e76890c86f053f7dfe34c80e))



## [0.1.1](https://github.com/imsunhao/utils/compare/v0.1.0...v0.1.1) (2020-05-03)


### Features

* [config] 补充 dependencies ([6402e78](https://github.com/imsunhao/utils/commit/6402e786de845bba73b5def936b316160d7b9de9))
* [server] 自动添加 NODE_ENV ([6048846](https://github.com/imsunhao/utils/commit/6048846ac5c42f8c8bf00e54306155cda1d922cd))



# [0.1.0](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.33...v0.1.0) (2020-04-28)


### Bug Fixes

* 修复 如果 release bin cmd为空 那么不会启动 ([2f19020](https://github.com/imsunhao/utils/commit/2f1902022d90868cae6ab624cbdd5496260386e8))


### Features

* 修复 changelog ([546c946](https://github.com/imsunhao/utils/commit/546c946f2c8012c1a81f72d3d1b47755e76e98a7))
* 修复 setting 带来的依赖混乱 ([0e4ef45](https://github.com/imsunhao/utils/commit/0e4ef45f500f03a7c3eede92d4b171d2656a5da9))
* 完善 类型支持 ([25553b5](https://github.com/imsunhao/utils/commit/25553b5d3c926f80b2078b056d5852e9db02db60))
* 扩展 relase 可以配置 inject-context ([8aa02a9](https://github.com/imsunhao/utils/commit/8aa02a9c861673fbf9ff8f0201f254251c01774a))
* 添加 helper 帮助 ([b7f96b5](https://github.com/imsunhao/utils/commit/b7f96b5b0ef60a9a9881d447a861acb1041a2231))
* 移除 start测试 ([8fc83c9](https://github.com/imsunhao/utils/commit/8fc83c90093eeed0a02f71dd9a9b5a2853498b62))
* 调整 git add -A 为精确 add ([456095b](https://github.com/imsunhao/utils/commit/456095ba1ff51cd73c5cf31d6d2185c39bb8b134))



## [0.0.1-alpha.38](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.8...v0.0.1-alpha.38) (2020-04-27)


### Bug Fixes

* [start] error lifeCycle undefined ([eb1cf2d](https://github.com/imsunhao/utils/commit/eb1cf2d7b12f7a09ca7e5bc036657a2e53501a01))
* [test] error ([4958712](https://github.com/imsunhao/utils/commit/4958712565af4a427d1f84f74b5b3f76dc6a3af0))
* [ts] shared 问题 ([ae53bd5](https://github.com/imsunhao/utils/commit/ae53bd5bd05c692d21470fd0e1a7d939ec73744d))
* build ts error ([be7ca6c](https://github.com/imsunhao/utils/commit/be7ca6cedf71fb0f14d9a746b6cb18035bbeed9a))
* export 修复 getConfigWebpackConfig is undefined ([81eddc5](https://github.com/imsunhao/utils/commit/81eddc5746797c1a30c4dff9cbcc9c337b0efc68))
* 修复 changelog ([0abb803](https://github.com/imsunhao/utils/commit/0abb8030ba17ea9d96991700ff4d99147936adfb))
* 修复 release脚本 ([d5f1e8e](https://github.com/imsunhao/utils/commit/d5f1e8e8fd816296b109855b2c362b24ba303e46))
* 修复 whitelist 失效 ([f420da9](https://github.com/imsunhao/utils/commit/f420da927788b18e0c107459dd0eb35bed6cdfc9))
* 修复 下载路径错误 问题 ([c473559](https://github.com/imsunhao/utils/commit/c473559b9e654ddb0bac31f55b1a283ec4726d3e))
* 修复 如果 release bin cmd为空 那么不会启动 ([ef74124](https://github.com/imsunhao/utils/commit/ef741243a606ff432824039d54a33238dfb26af8))


### Features

* [release] 添加 依赖注入 tag ([b5b75ee](https://github.com/imsunhao/utils/commit/b5b75eeb813c844c1603ed88d63237f789eccbe2))
* [server] 添加 default beforeRenderSend ([4b5a6d0](https://github.com/imsunhao/utils/commit/4b5a6d0ad251d08dcd6068b6814fed7f73ec8bd0))
* add start port ([d0d0298](https://github.com/imsunhao/utils/commit/d0d0298a0939cfb2714ed1fae0ec4b205c5ecf6e))
* args 添加 inject-context 支持 ([da0ad2a](https://github.com/imsunhao/utils/commit/da0ad2aeabb03c72dba5e14b3475213059ad703f))
* build 命令支持同步操作 ([daf99c8](https://github.com/imsunhao/utils/commit/daf99c8a2050b552a226c9eee8276dfc34dcdce9))
* common-asset -> common-assets ([867014a](https://github.com/imsunhao/utils/commit/867014aa51ca285bad352b9cc6c8d4f145cbd8ce))
* dev html hot-reload ([48cf949](https://github.com/imsunhao/utils/commit/48cf9492a8e63816041885334e0819e0a7d6e979))
* download 确保目标文件夹存在 ([fafec8d](https://github.com/imsunhao/utils/commit/fafec8dac861546ddcd1347809d13b1fede481c6))
* release ([d871b78](https://github.com/imsunhao/utils/commit/d871b788ccc10adffb8079edca6853ef4a7afa74))
* release 拓展 ([202a50c](https://github.com/imsunhao/utils/commit/202a50c0d3181e5804f86e764072f273966a75ec))
* release 添加 skip-version dry 命令 ([7c67b1c](https://github.com/imsunhao/utils/commit/7c67b1ca482b983156b94fd452b9620943a64c23))
* remove default file-loader ([ce45416](https://github.com/imsunhao/utils/commit/ce454169f6026dd67f444200d4e5d0329734157e))
* ssr-exclude-module 添加 emptyModule ([ff80d3d](https://github.com/imsunhao/utils/commit/ff80d3d15064bf82ffc4fe4a7cbb9203b7b70989))
* start exportSSRStartConfig 添加 pathResolve ([a1a39e1](https://github.com/imsunhao/utils/commit/a1a39e1ea7720d40c69472c515c883abd336d9ac))
* test 添加 过滤无用目录 ([a35cdac](https://github.com/imsunhao/utils/commit/a35cdac57f2270d61e4f1d70104efd307663ff69))
* 优化 发布流程 ([f3a1bc4](https://github.com/imsunhao/utils/commit/f3a1bc43c4ce0829ed212633df32b6259c881b47))
* 修复 setting 带来的依赖混乱 ([5345122](https://github.com/imsunhao/utils/commit/53451220f0bcf3cb2c7c42c08f24b8bb1167cd84))
* 完善 exclude 与 whitelist 的关系 ([4b7c279](https://github.com/imsunhao/utils/commit/4b7c2792c567a792bd8c02e25560a775f26ef1b5))
* 完善 类型支持 ([55d8fe6](https://github.com/imsunhao/utils/commit/55d8fe69e8eeb18dbbb6fc974e2ed56e108e0478))
* 暴露 release 内部方法 ([8847d0c](https://github.com/imsunhao/utils/commit/8847d0c4e09c35be66af8b46ef4801f4b18a341a))
* 添加 AssetsHelper 测试 ([0c4a7f4](https://github.com/imsunhao/utils/commit/0c4a7f48be31f9156c4e12dc48173a269bc3651b))
* 添加 cache-loader 与 thread-loader ([f3ab683](https://github.com/imsunhao/utils/commit/f3ab683efd5012a5de78214b0d173634b191ac2c))
* 添加 server-life, base webpack-merge 支持 ([2ddd119](https://github.com/imsunhao/utils/commit/2ddd1197388fc1d61c5879b5801740907a92702b))
* 添加 terser-webpack-plugin options ([ccc308d](https://github.com/imsunhao/utils/commit/ccc308d47420d58fdd27d116c95ef2f85ca9128d))
* 添加 todo ([42a7780](https://github.com/imsunhao/utils/commit/42a77809d85f0e74a37775a09e28d78bb19b293b))
* 移除 start测试 ([8fc83c9](https://github.com/imsunhao/utils/commit/8fc83c90093eeed0a02f71dd9a9b5a2853498b62))
* 移除 无用的 devDependencies ([69eb9cc](https://github.com/imsunhao/utils/commit/69eb9cc940bcd47a60a9ab0345445c090236f961))
* 类型注释等优化 ([74f3541](https://github.com/imsunhao/utils/commit/74f35414b35ce449913f5364942c4627c76faddf))
* 调整 git add -A 为精确 add ([558d816](https://github.com/imsunhao/utils/commit/558d816d315a1d011bb34269db82754e9aee63ee))
* 调整 port 规则 ([e9dc02b](https://github.com/imsunhao/utils/commit/e9dc02b9971e3e1cf36b698cf944f55bca2d5be7))


## [0.0.1-alpha.13](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.12...v0.0.1-alpha.13) (2020-04-01)


### Features

* add start port ([1ece21c](https://github.com/imsunhao/utils/commit/1ece21c4ce11f462513f0c350f35a7eaef954116))
* test 添加 过滤无用目录 ([a35cdac](https://github.com/imsunhao/utils/commit/a35cdac57f2270d61e4f1d70104efd307663ff69))
* 添加 cache-loader 与 thread-loader ([f3ab683](https://github.com/imsunhao/utils/commit/f3ab683efd5012a5de78214b0d173634b191ac2c))



## [0.0.1-alpha.12](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.11...v0.0.1-alpha.12) (2020-03-16)


### Bug Fixes

* export 修复 getConfigWebpackConfig is undefined ([81eddc5](https://github.com/imsunhao/utils/commit/81eddc5746797c1a30c4dff9cbcc9c337b0efc68))
* 修复 whitelist 失效 ([f420da9](https://github.com/imsunhao/utils/commit/f420da927788b18e0c107459dd0eb35bed6cdfc9))


### Reverts

* Revert "fix: exclude css 被排除" ([a1aeaec](https://github.com/imsunhao/utils/commit/a1aeaec61a2f0ce7165ec6cd1726fa3171ab09ea))



## [0.0.1-alpha.11](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.10...v0.0.1-alpha.11) (2020-03-16)


### Bug Fixes

* [test] error ([4958712](https://github.com/imsunhao/utils/commit/4958712565af4a427d1f84f74b5b3f76dc6a3af0))
* exclude css 被排除 ([8380e3d](https://github.com/imsunhao/utils/commit/8380e3daa0a8d33d2f4d558d77f00bd5e4661c9a))


### Features

* [server] 添加 default beforeRenderSend ([4b5a6d0](https://github.com/imsunhao/utils/commit/4b5a6d0ad251d08dcd6068b6814fed7f73ec8bd0))



## [0.0.1-alpha.10](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.9...v0.0.1-alpha.10) (2020-03-16)


### Bug Fixes

* [start] error lifeCycle undefined ([eb1cf2d](https://github.com/imsunhao/utils/commit/eb1cf2d7b12f7a09ca7e5bc036657a2e53501a01))
* build ts error ([be7ca6c](https://github.com/imsunhao/utils/commit/be7ca6cedf71fb0f14d9a746b6cb18035bbeed9a))


### Features

* args 添加 inject-context 支持 ([da0ad2a](https://github.com/imsunhao/utils/commit/da0ad2aeabb03c72dba5e14b3475213059ad703f))
* common-asset -> common-assets ([867014a](https://github.com/imsunhao/utils/commit/867014aa51ca285bad352b9cc6c8d4f145cbd8ce))
* dev html hot-reload ([48cf949](https://github.com/imsunhao/utils/commit/48cf9492a8e63816041885334e0819e0a7d6e979))
* start exportSSRStartConfig 添加 pathResolve ([a1a39e1](https://github.com/imsunhao/utils/commit/a1a39e1ea7720d40c69472c515c883abd336d9ac))
* 完善 exclude 与 whitelist 的关系 ([4b7c279](https://github.com/imsunhao/utils/commit/4b7c2792c567a792bd8c02e25560a775f26ef1b5))
* 添加 terser-webpack-plugin options ([ccc308d](https://github.com/imsunhao/utils/commit/ccc308d47420d58fdd27d116c95ef2f85ca9128d))
* 添加 todo ([42a7780](https://github.com/imsunhao/utils/commit/42a77809d85f0e74a37775a09e28d78bb19b293b))
* 移除 无用的 devDependencies ([69eb9cc](https://github.com/imsunhao/utils/commit/69eb9cc940bcd47a60a9ab0345445c090236f961))
* 调整 port 规则 ([e9dc02b](https://github.com/imsunhao/utils/commit/e9dc02b9971e3e1cf36b698cf944f55bca2d5be7))



## [0.0.1-alpha.9](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.8...v0.0.1-alpha.9) (2020-03-14)


### Features

* ssr-exclude-module 添加 emptyModule ([ff80d3d](https://github.com/imsunhao/utils/commit/ff80d3d15064bf82ffc4fe4a7cbb9203b7b70989))



## [0.0.1-alpha.8](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2020-03-11)


### Bug Fixes

* [test] error ([e5ee870](https://github.com/imsunhao/utils/commit/e5ee87035bc0871e0ebf30c66e97021c873116be))
* [test] error ([2fc4c06](https://github.com/imsunhao/utils/commit/2fc4c06afb419018a1dbcfa910f5f1d6b687ce7f))


### Features

* helper can use in dependencies ([d3cfbab](https://github.com/imsunhao/utils/commit/d3cfbabc99ce8b1a1a4f6c8bd53c5dbdaa10970e))
* move remove-code-block to config ([71b5146](https://github.com/imsunhao/utils/commit/71b5146bd80339c944fb15fb6a877260d2fb567c))
* remove manifest-plugin ([1a0d3e2](https://github.com/imsunhao/utils/commit/1a0d3e24fa280c0372f0fa6c58738f561bcb836d))
* 添加 nodeExternals whitelist 支持 ([e9a7c37](https://github.com/imsunhao/utils/commit/e9a7c37f98b1d470b27170e00bf2f8bfe434ea52))
* 添加 ssr-exclude-module ([f106dec](https://github.com/imsunhao/utils/commit/f106deca397db16c3af9aeb3099a224cadca8ecc))



## [0.0.1-alpha.7](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2020-03-09)


### Bug Fixes

* [e2e] 修复 certificate error ([37eda07](https://github.com/imsunhao/utils/commit/37eda07e8fc3119859e06516886a2b82d2869f96))
* default ProxyTable ([15b3b48](https://github.com/imsunhao/utils/commit/15b3b48628f3419c3e02d1e01ded717eb918cd57))
* 修复 测试错误 ([7f31a23](https://github.com/imsunhao/utils/commit/7f31a235d39b292d9744f9bd99e70c72164ed35c))


### Features

* build 命令 自动清空输出目录 ([fb430e6](https://github.com/imsunhao/utils/commit/fb430e64ffd252afbc6bdb53d84396aec60af61f))
* inject-context ([75c6469](https://github.com/imsunhao/utils/commit/75c646915024ca8a35c9466621e0068e746133c2))
* relase 基础 ([c43d7ce](https://github.com/imsunhao/utils/commit/c43d7ceb65ae079962afa75355215a8f2c3e0ec5))
* upgrade typescript 3.8 ([89f6683](https://github.com/imsunhao/utils/commit/89f668309de867967353968a697b261bf29c2d78))
* 优化 require 规则 ([d84392e](https://github.com/imsunhao/utils/commit/d84392e2be18107ec024f36c01ace927140ba21d))
* 优化代码结构 ([5890019](https://github.com/imsunhao/utils/commit/58900190f1ec80bf4f1e99ef988e4af3b42e295f))
* 使用 debounce 优化 hotReload ([20b07cb](https://github.com/imsunhao/utils/commit/20b07cbdf6bc691a7552a726b5542a016fb71f29))
* 完善 eslint 检查 ([67b5ea9](https://github.com/imsunhao/utils/commit/67b5ea9d172763d91e86cd55b36b30efa8e52a57))
* 对 缓存DLL的检查 更加严格 ([1c629dc](https://github.com/imsunhao/utils/commit/1c629dcb835701faf974fb0e27032a12ed1baa2c))
* 支持 dev模式  https 启动 ([3b2b210](https://github.com/imsunhao/utils/commit/3b2b2102783b3dcbb0cbf11ef758d9cfb16a0e83))
* 添加 build files-manifest 功能 ([d1fde71](https://github.com/imsunhao/utils/commit/d1fde71e0f5856ac48c6ee9c61050dbe084bccb8))
* 添加 start命令 ([960cfc8](https://github.com/imsunhao/utils/commit/960cfc806d422d53059d09ba139ffac5e3f287d3))
* 添加 样式处理 ([521482f](https://github.com/imsunhao/utils/commit/521482f07c4d47a78fcd23b9ac7ba2a372cfa369))



## [0.0.1-alpha.6](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.5...v0.0.1-alpha.6) (2020-02-21)


### Bug Fixes

* [test]修复 config --case=07 ([bf3dc89](https://github.com/imsunhao/utils/commit/bf3dc89de6403f57157c44465691b095265e8110))


### Features

* [e2e] 添加 action功能 ([4809645](https://github.com/imsunhao/utils/commit/480964554cf8bd2959d8624af8147c181b9d7097))
* 修复 ts缺少的类型 ([9726be3](https://github.com/imsunhao/utils/commit/9726be300c30ba8187c0990938ea9b75b3337a0d))
* 更新 依赖版本 ([afb42f4](https://github.com/imsunhao/utils/commit/afb42f4f46fec5466032c4540d2395ce235e68ae))
* 添加 build 命令 ([8cf4950](https://github.com/imsunhao/utils/commit/8cf49507b78a4b59958eb198182c3d53b6b7166a))
* 添加 dll 概念 ([c4ddb56](https://github.com/imsunhao/utils/commit/c4ddb568aa9b31be02b90e73b7824a084c37be80))
* 调整 cache 逻辑 ([f6949dd](https://github.com/imsunhao/utils/commit/f6949dd8fd220cefbf4db269bbb740897b84193d))
* 调整 DLL方案 现在支持依赖DLL ([aa67625](https://github.com/imsunhao/utils/commit/aa6762512429f8ce8af01a8f347cfb5d2a14295f))



## [0.0.1-alpha.5](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.2...v0.0.1-alpha.5) (2020-02-16)


### Bug Fixes

* 防止 server端 next后 未返回 ([15a0a81](https://github.com/imsunhao/utils/commit/15a0a819861bbf26824bac24a4107f83c0b13b7c))


### Features

* [helper] 添加 createAxiosHelper ([0ec7790](https://github.com/imsunhao/utils/commit/0ec7790f6a40af831824dc38cfc53ee4dafad446))
* TODO 01-prod-default--server-config ([d46c475](https://github.com/imsunhao/utils/commit/d46c4750b4e10355d098ed05aa088b0550e90f3d))
* 优化 测试代码 结构 ([afa89ac](https://github.com/imsunhao/utils/commit/afa89acceba8c454472178eb0ca871d5faddd062))
* 优化代码 ([f19c790](https://github.com/imsunhao/utils/commit/f19c79094164c992a62ed73902a375c123232b27))
* 初步 完成 dev ([2a0515a](https://github.com/imsunhao/utils/commit/2a0515aaeee5d668fa12b3c7067f0fa01f0c0e1a))
* 初步 建立项目依赖关系,发现开发存在许多不方便的地方 ([76a3f85](https://github.com/imsunhao/utils/commit/76a3f85c1eb27a6e019e775e73bd0b001d79e013))
* 初步完成 web-step->config->compiler ([7ff87a8](https://github.com/imsunhao/utils/commit/7ff87a8a56eef197e8aebfeda1a7c64b0c851111))
* 完善 web-steps compiler ([30b1565](https://github.com/imsunhao/utils/commit/30b1565f94cec859659e57cdd7a1f43d58c98f7d))
* 完善 服务端 热加载 ([c5ea51a](https://github.com/imsunhao/utils/commit/c5ea51a32f63099ccda29d8b0e91f8190324ee70))
* 完成 server prod [SSR] ([a6ecaea](https://github.com/imsunhao/utils/commit/a6ecaeaa5e8a6c8b3c25ff879f4f1640e9ba417e))
* 完成 server-router-vuex ([650fe70](https://github.com/imsunhao/utils/commit/650fe7094b7c4f89fece3768075793e564831c8e))
* 完成 web-step->config->compiler ([da2d95b](https://github.com/imsunhao/utils/commit/da2d95bd35c1a07fb0bc2b57b985706bf9a4be46))
* 完成 web-step->config->compiler[SSR, Vue] ([1f417aa](https://github.com/imsunhao/utils/commit/1f417aaf6262f494b1f905f3498b7d45c1475435))
* 开放config 移除test ([10e02f0](https://github.com/imsunhao/utils/commit/10e02f006d97190e77b645794f2adeb665f397d9))
* 引入 helper 模块 ([048e8e2](https://github.com/imsunhao/utils/commit/048e8e230b7f60dc85d2a7c61fc986e19aa3eb52))
* 测试npm 发布 ([6103c0e](https://github.com/imsunhao/utils/commit/6103c0e85d70f5a1d9bd271aeac629cb9e570450))
* 添加 compiler 基础 ([8497cd8](https://github.com/imsunhao/utils/commit/8497cd8a89d550ae115c972401ebbad20657ad3c))
* 添加 config export 功能 ([f0ff911](https://github.com/imsunhao/utils/commit/f0ff91131be2fadfe93dc095e2c0b23b61b5e5ff))
* 添加 configConstructor 概念 ([0ddcbad](https://github.com/imsunhao/utils/commit/0ddcbad4a98e019391e019a3f9c5d9c0df7253db))
* 添加 getBaseConfig 测试 ([d302d50](https://github.com/imsunhao/utils/commit/d302d5028d0c9dafa8d6a2cc187dfa9d0c5d3161))
* 添加 Log 类, 统一管理 日志信息 ([6df68cb](https://github.com/imsunhao/utils/commit/6df68cbdc033bd4cec6ce8cf3382ef969bc06356))
* 添加 minor command ([b1466fe](https://github.com/imsunhao/utils/commit/b1466fe67017e6e1b692b95bd4203cf618d08903))
* 添加 node进程关闭时 关闭 Service ([fbb151b](https://github.com/imsunhao/utils/commit/fbb151bb30a0dd7830a5d0fb15357e00fb3571e6))
* 添加 RemoveCodeBlock ([6608dad](https://github.com/imsunhao/utils/commit/6608dad3563c86431b6742fea8439af28fd8f5e5))
* 添加 res.locals 概念 ([a20bb29](https://github.com/imsunhao/utils/commit/a20bb298a34f7a76dbbe765fe1f1a52bee62c9ae))
* 添加 setting config 读取基础 与 单元测试 ([f9ce093](https://github.com/imsunhao/utils/commit/f9ce09370b4e1f1a391f8b9db09c8b97afbad1d8))
* 添加 shared 概念, 存放 共享代码 ([bb82c68](https://github.com/imsunhao/utils/commit/bb82c68af898b3f09fa48512eae21e9fff90c27e))
* 添加 StartupOptions 概念 ([58d1384](https://github.com/imsunhao/utils/commit/58d1384f5f31062b644dfda4fd29d2bcba05b580))
* 添加 svg-icon-loader 基础 ([c876e58](https://github.com/imsunhao/utils/commit/c876e5871ad33d041168dbe55b1cbe6a1c64cd00))
* 添加 vuex-hot-reload ([0aa8220](https://github.com/imsunhao/utils/commit/0aa8220594e09115a1aaccb066b9f4a2ee394515))
* 补全遗漏 bin命令 ([7fdad31](https://github.com/imsunhao/utils/commit/7fdad3148570c49ebae7bc36a516300bf450973e))
* 调整 ProcessMessage 类型 与 process.send 类型增强 ([ea4fdc1](https://github.com/imsunhao/utils/commit/ea4fdc1f202079bc8d64c89f893c29ad4feafd8d))
* 调整 代码结构 ([09f7bf7](https://github.com/imsunhao/utils/commit/09f7bf7a092ccef8e4839294d3511dc2c524e5a8))
* 调整 单元测试 结构 ([8ca6aff](https://github.com/imsunhao/utils/commit/8ca6affa630b6ed6d3d5503667ac96af7271ae95))
* 重命名所有的测试名称 ([a4e2b6d](https://github.com/imsunhao/utils/commit/a4e2b6d78fc0338c92616025e7870ae19f849645))
* 防止 dev模式 无限循环 打包 ([47bef50](https://github.com/imsunhao/utils/commit/47bef50ca578890afb594d9ab4a62d55550de200))



## [0.0.1-alpha.4](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.2...v0.0.1-alpha.4) (2020-02-16)


### Bug Fixes

* 防止 server端 next后 未返回 ([15a0a81](https://github.com/imsunhao/utils/commit/15a0a819861bbf26824bac24a4107f83c0b13b7c))


### Features

* [helper] 添加 createAxiosHelper ([0ec7790](https://github.com/imsunhao/utils/commit/0ec7790f6a40af831824dc38cfc53ee4dafad446))
* TODO 01-prod-default--server-config ([d46c475](https://github.com/imsunhao/utils/commit/d46c4750b4e10355d098ed05aa088b0550e90f3d))
* 优化 测试代码 结构 ([afa89ac](https://github.com/imsunhao/utils/commit/afa89acceba8c454472178eb0ca871d5faddd062))
* 优化代码 ([f19c790](https://github.com/imsunhao/utils/commit/f19c79094164c992a62ed73902a375c123232b27))
* 初步 完成 dev ([2a0515a](https://github.com/imsunhao/utils/commit/2a0515aaeee5d668fa12b3c7067f0fa01f0c0e1a))
* 初步 建立项目依赖关系,发现开发存在许多不方便的地方 ([76a3f85](https://github.com/imsunhao/utils/commit/76a3f85c1eb27a6e019e775e73bd0b001d79e013))
* 初步完成 web-step->config->compiler ([7ff87a8](https://github.com/imsunhao/utils/commit/7ff87a8a56eef197e8aebfeda1a7c64b0c851111))
* 完善 web-steps compiler ([30b1565](https://github.com/imsunhao/utils/commit/30b1565f94cec859659e57cdd7a1f43d58c98f7d))
* 完善 服务端 热加载 ([c5ea51a](https://github.com/imsunhao/utils/commit/c5ea51a32f63099ccda29d8b0e91f8190324ee70))
* 完成 server prod [SSR] ([a6ecaea](https://github.com/imsunhao/utils/commit/a6ecaeaa5e8a6c8b3c25ff879f4f1640e9ba417e))
* 完成 server-router-vuex ([650fe70](https://github.com/imsunhao/utils/commit/650fe7094b7c4f89fece3768075793e564831c8e))
* 完成 web-step->config->compiler ([da2d95b](https://github.com/imsunhao/utils/commit/da2d95bd35c1a07fb0bc2b57b985706bf9a4be46))
* 完成 web-step->config->compiler[SSR, Vue] ([1f417aa](https://github.com/imsunhao/utils/commit/1f417aaf6262f494b1f905f3498b7d45c1475435))
* 开放config 移除test ([10e02f0](https://github.com/imsunhao/utils/commit/10e02f006d97190e77b645794f2adeb665f397d9))
* 引入 helper 模块 ([048e8e2](https://github.com/imsunhao/utils/commit/048e8e230b7f60dc85d2a7c61fc986e19aa3eb52))
* 添加 compiler 基础 ([8497cd8](https://github.com/imsunhao/utils/commit/8497cd8a89d550ae115c972401ebbad20657ad3c))
* 添加 config export 功能 ([f0ff911](https://github.com/imsunhao/utils/commit/f0ff91131be2fadfe93dc095e2c0b23b61b5e5ff))
* 添加 configConstructor 概念 ([0ddcbad](https://github.com/imsunhao/utils/commit/0ddcbad4a98e019391e019a3f9c5d9c0df7253db))
* 添加 getBaseConfig 测试 ([d302d50](https://github.com/imsunhao/utils/commit/d302d5028d0c9dafa8d6a2cc187dfa9d0c5d3161))
* 添加 Log 类, 统一管理 日志信息 ([6df68cb](https://github.com/imsunhao/utils/commit/6df68cbdc033bd4cec6ce8cf3382ef969bc06356))
* 添加 minor command ([b1466fe](https://github.com/imsunhao/utils/commit/b1466fe67017e6e1b692b95bd4203cf618d08903))
* 添加 node进程关闭时 关闭 Service ([fbb151b](https://github.com/imsunhao/utils/commit/fbb151bb30a0dd7830a5d0fb15357e00fb3571e6))
* 添加 RemoveCodeBlock ([6608dad](https://github.com/imsunhao/utils/commit/6608dad3563c86431b6742fea8439af28fd8f5e5))
* 添加 res.locals 概念 ([a20bb29](https://github.com/imsunhao/utils/commit/a20bb298a34f7a76dbbe765fe1f1a52bee62c9ae))
* 添加 setting config 读取基础 与 单元测试 ([f9ce093](https://github.com/imsunhao/utils/commit/f9ce09370b4e1f1a391f8b9db09c8b97afbad1d8))
* 添加 shared 概念, 存放 共享代码 ([bb82c68](https://github.com/imsunhao/utils/commit/bb82c68af898b3f09fa48512eae21e9fff90c27e))
* 添加 StartupOptions 概念 ([58d1384](https://github.com/imsunhao/utils/commit/58d1384f5f31062b644dfda4fd29d2bcba05b580))
* 添加 svg-icon-loader 基础 ([c876e58](https://github.com/imsunhao/utils/commit/c876e5871ad33d041168dbe55b1cbe6a1c64cd00))
* 添加 vuex-hot-reload ([0aa8220](https://github.com/imsunhao/utils/commit/0aa8220594e09115a1aaccb066b9f4a2ee394515))
* 调整 ProcessMessage 类型 与 process.send 类型增强 ([ea4fdc1](https://github.com/imsunhao/utils/commit/ea4fdc1f202079bc8d64c89f893c29ad4feafd8d))
* 调整 代码结构 ([09f7bf7](https://github.com/imsunhao/utils/commit/09f7bf7a092ccef8e4839294d3511dc2c524e5a8))
* 调整 单元测试 结构 ([8ca6aff](https://github.com/imsunhao/utils/commit/8ca6affa630b6ed6d3d5503667ac96af7271ae95))
* 重命名所有的测试名称 ([a4e2b6d](https://github.com/imsunhao/utils/commit/a4e2b6d78fc0338c92616025e7870ae19f849645))
* 防止 dev模式 无限循环 打包 ([47bef50](https://github.com/imsunhao/utils/commit/47bef50ca578890afb594d9ab4a62d55550de200))



## [0.0.1-alpha.3](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.2...v0.0.1-alpha.3) (2020-02-16)


### Features

* [helper] 添加 createAxiosHelper ([0ec7790](https://github.com/imsunhao/utils/commit/0ec7790f6a40af831824dc38cfc53ee4dafad446))
* TODO 01-prod-default--server-config ([d46c475](https://github.com/imsunhao/utils/commit/d46c4750b4e10355d098ed05aa088b0550e90f3d))
* 优化 测试代码 结构 ([afa89ac](https://github.com/imsunhao/utils/commit/afa89acceba8c454472178eb0ca871d5faddd062))
* 优化代码 ([f19c790](https://github.com/imsunhao/utils/commit/f19c79094164c992a62ed73902a375c123232b27))
* 初步 完成 dev ([2a0515a](https://github.com/imsunhao/utils/commit/2a0515aaeee5d668fa12b3c7067f0fa01f0c0e1a))
* 初步 建立项目依赖关系,发现开发存在许多不方便的地方 ([76a3f85](https://github.com/imsunhao/utils/commit/76a3f85c1eb27a6e019e775e73bd0b001d79e013))
* 初步完成 web-step->config->compiler ([7ff87a8](https://github.com/imsunhao/utils/commit/7ff87a8a56eef197e8aebfeda1a7c64b0c851111))
* 完善 web-steps compiler ([30b1565](https://github.com/imsunhao/utils/commit/30b1565f94cec859659e57cdd7a1f43d58c98f7d))
* 完善 服务端 热加载 ([c5ea51a](https://github.com/imsunhao/utils/commit/c5ea51a32f63099ccda29d8b0e91f8190324ee70))
* 完成 server prod [SSR] ([a6ecaea](https://github.com/imsunhao/utils/commit/a6ecaeaa5e8a6c8b3c25ff879f4f1640e9ba417e))
* 完成 server-router-vuex ([650fe70](https://github.com/imsunhao/utils/commit/650fe7094b7c4f89fece3768075793e564831c8e))
* 完成 web-step->config->compiler ([da2d95b](https://github.com/imsunhao/utils/commit/da2d95bd35c1a07fb0bc2b57b985706bf9a4be46))
* 完成 web-step->config->compiler[SSR, Vue] ([1f417aa](https://github.com/imsunhao/utils/commit/1f417aaf6262f494b1f905f3498b7d45c1475435))
* 开放config 移除test ([10e02f0](https://github.com/imsunhao/utils/commit/10e02f006d97190e77b645794f2adeb665f397d9))
* 引入 helper 模块 ([048e8e2](https://github.com/imsunhao/utils/commit/048e8e230b7f60dc85d2a7c61fc986e19aa3eb52))
* 添加 compiler 基础 ([8497cd8](https://github.com/imsunhao/utils/commit/8497cd8a89d550ae115c972401ebbad20657ad3c))
* 添加 config export 功能 ([f0ff911](https://github.com/imsunhao/utils/commit/f0ff91131be2fadfe93dc095e2c0b23b61b5e5ff))
* 添加 configConstructor 概念 ([0ddcbad](https://github.com/imsunhao/utils/commit/0ddcbad4a98e019391e019a3f9c5d9c0df7253db))
* 添加 getBaseConfig 测试 ([d302d50](https://github.com/imsunhao/utils/commit/d302d5028d0c9dafa8d6a2cc187dfa9d0c5d3161))
* 添加 Log 类, 统一管理 日志信息 ([6df68cb](https://github.com/imsunhao/utils/commit/6df68cbdc033bd4cec6ce8cf3382ef969bc06356))
* 添加 minor command ([b1466fe](https://github.com/imsunhao/utils/commit/b1466fe67017e6e1b692b95bd4203cf618d08903))
* 添加 node进程关闭时 关闭 Service ([fbb151b](https://github.com/imsunhao/utils/commit/fbb151bb30a0dd7830a5d0fb15357e00fb3571e6))
* 添加 RemoveCodeBlock ([6608dad](https://github.com/imsunhao/utils/commit/6608dad3563c86431b6742fea8439af28fd8f5e5))
* 添加 res.locals 概念 ([a20bb29](https://github.com/imsunhao/utils/commit/a20bb298a34f7a76dbbe765fe1f1a52bee62c9ae))
* 添加 setting config 读取基础 与 单元测试 ([f9ce093](https://github.com/imsunhao/utils/commit/f9ce09370b4e1f1a391f8b9db09c8b97afbad1d8))
* 添加 shared 概念, 存放 共享代码 ([bb82c68](https://github.com/imsunhao/utils/commit/bb82c68af898b3f09fa48512eae21e9fff90c27e))
* 添加 StartupOptions 概念 ([58d1384](https://github.com/imsunhao/utils/commit/58d1384f5f31062b644dfda4fd29d2bcba05b580))
* 添加 svg-icon-loader 基础 ([c876e58](https://github.com/imsunhao/utils/commit/c876e5871ad33d041168dbe55b1cbe6a1c64cd00))
* 添加 vuex-hot-reload ([0aa8220](https://github.com/imsunhao/utils/commit/0aa8220594e09115a1aaccb066b9f4a2ee394515))
* 调整 ProcessMessage 类型 与 process.send 类型增强 ([ea4fdc1](https://github.com/imsunhao/utils/commit/ea4fdc1f202079bc8d64c89f893c29ad4feafd8d))
* 调整 代码结构 ([09f7bf7](https://github.com/imsunhao/utils/commit/09f7bf7a092ccef8e4839294d3511dc2c524e5a8))
* 调整 单元测试 结构 ([8ca6aff](https://github.com/imsunhao/utils/commit/8ca6affa630b6ed6d3d5503667ac96af7271ae95))
* 重命名所有的测试名称 ([a4e2b6d](https://github.com/imsunhao/utils/commit/a4e2b6d78fc0338c92616025e7870ae19f849645))
* 防止 dev模式 无限循环 打包 ([47bef50](https://github.com/imsunhao/utils/commit/47bef50ca578890afb594d9ab4a62d55550de200))



## [0.0.1-alpha.2](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.1...v0.0.1-alpha.2) (2020-01-26)


### Features

* 将 bin 改名为 cli ([19bbb39](https://github.com/imsunhao/utils/commit/19bbb39c98bc0ef2afd0145a135c0b13550713d3))



## [0.0.1-alpha.1](https://github.com/imsunhao/utils/compare/v0.0.1-alpha.0...v0.0.1-alpha.1) (2020-01-25)


### Features

* 准备测试 内联 类型支持 ([fb6e838](https://github.com/imsunhao/utils/commit/fb6e8383867aa8bcc9c0b1d2c1a0398deceb38ec))
* 根据设计图重新规划 ([e0d0ec2](https://github.com/imsunhao/utils/commit/e0d0ec2c49302c591ac1584069df1df608cad3b9))