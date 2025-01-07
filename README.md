# Uniswap Interface（v2）

Uniswap前端项目，适配了 sepolia 网络。

## 部署
### 安装依赖
```bash
yarn
```
### 准备
执行脚本初始化环境
```
node scripts/init.js
```
导入infura的INFURA_API_KEY环境变量
```
export INFURA_API_KEY=xxx
```

### 运行
```bash
yarn start
```
若node版本 >= 17，启动时需要加入如下环境变量 `export NODE_OPTIONS=--openssl-legacy-provider`