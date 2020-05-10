# @web-steps/server

## 常见问题

### 关于 life-cycle 中 如何判断是否为初始化加载 life-cycle 的解决方案

可以在 life-cycle.ts 中, 添加以下代码解决

```typescript

const INIT_LIFE_CYCLE = process.env.INIT_LIFE_CYCLE
if (!INIT_LIFE_CYCLE) process.env.INIT_LIFE_CYCLE = 'TRUE'

```

