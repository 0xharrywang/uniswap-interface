# Uniswap Interface（v2）

Uniswap前端项目，适配了 sepolia 网络。

## 部署
### 安装依赖
```bash
yarn
```
### 配置
修改 interface 目录下.env 中对应的网络环境变量
```
REACT_APP_CHAIN_ID="5"
REACT_APP_NETWORK_URL="https://mainnet.infura.io/v3/${api-key}"
```
修改`src/constants/index.ts`



修改`forks/@uniswap/sdk/dist/sdk.esm.js`

```

```

### 运行
```bash
yarn start
```
注意：若node版本 >= 17，启动时需要加入如下环境变量 `export NODE_OPTIONS=--openssl-legacy-provider`