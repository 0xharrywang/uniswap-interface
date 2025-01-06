const path = require('path');
const fs = require('fs');

// 原来的地址
const ORIGIN_INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const ORIGIN_WETH_ADDRESS = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
const ORIGIN_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const ORIGIN_ROUTER01_ADDRESS = '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a';
const ORIGIN_ROUTER02_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const ORIGIN_MULTICALL_ADDRESS = '0x25Eef291876194AeFAd0D60Dff89e268b90754Bb';

// 新地址
const INIT_CODE_HASH = '79681bc74104e3832134fbdbf4e4da393567d488beea1ff08eaad502457ed2c6';
const WETH_ADDRESS = '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9';
const FACTORY_ADDRESS = '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8';
const ROUTER01_ADDRESS = '0x851356ae760d987E095750cCeb3bC6014560891C';
const ROUTER02_ADDRESS = '0xf5059a5D33d5853360D16C683c16e67980206f36';
const MULTICALL_ADDRESS = ORIGIN_MULTICALL_ADDRESS;

// // 恢复原地址
// const INIT_CODE_HASH = ORIGIN_INIT_CODE_HASH;
// const WETH_ADDRESS = ORIGIN_WETH_ADDRESS;
// const FACTORY_ADDRESS = ORIGIN_FACTORY_ADDRESS;
// const ROUTER01_ADDRESS = ORIGIN_ROUTER01_ADDRESS;
// const ROUTER02_ADDRESS = ORIGIN_ROUTER02_ADDRESS;
// const MULTICALL_ADDRESS = ORIGIN_MULTICALL_ADDRESS;


function init() {

  // 将 ROUTER_ADDRESS 修改为 UniswapV2Router02 地址
  replaceContent(
    '../src/constants/index.ts',
    [
      {oldLine : /ROUTER_ADDRESS = '.*?'/, newLine: `ROUTER_ADDRESS = '${ROUTER02_ADDRESS}'`},
    ]
  );

  // 文件中 BAD_RECIPIENT_ADDRESSES 数组的值修改为 UniswapV2Factory、UniswapV2Router01、UniswapV2Router02
  replaceContent(
    '../src/state/swap/hooks.ts',
    [
      {oldLine : /.*\/\/\s*v2 factory/,   newLine: `  '${FACTORY_ADDRESS}', // v2 factory`},
      {oldLine : /.*\/\/\s*v2 router 01/, newLine: `  '${ROUTER01_ADDRESS}', // v2 router 01`},
      {oldLine : /.*\/\/\s*v2 router 02/, newLine: `  '${ROUTER02_ADDRESS}' // v2 router 02`},
    ]
  );
  
  //// 修改下面三个文件

  // constants.d.ts
  replaceContent(
    '../forks/@uniswap/sdk/dist/constants.d.ts',
    [
      // 修改 FACTORY_ADDRESS 与 INIT_CODE_HASH 
      {oldLine : /FACTORY_ADDRESS = '.*?'/, newLine: `FACTORY_ADDRESS = '${FACTORY_ADDRESS}'`},
      {oldLine : /INIT_CODE_HASH = '.*?'/, newLine: `INIT_CODE_HASH = '${INIT_CODE_HASH}'`},
    ]
  );

  // sdk.cjs.development.js
  replaceContent(
    '../forks/@uniswap/sdk/dist/sdk.cjs.development.js',
    [
       // 修改 FACTORY_ADDRESS 与 INIT_CODE_HASH 
      {oldLine : /FACTORY_ADDRESS = '.*?'/, newLine: `FACTORY_ADDRESS = '${FACTORY_ADDRESS}'`},
      {oldLine : /INIT_CODE_HASH = '.*?'/, newLine: `INIT_CODE_HASH = '${INIT_CODE_HASH}'`},
      // 修改 WETH 地址, 注意是 exports.ChainId.SEPOLIA
      {oldLine : /_WETH\[exports\.ChainId\.SEPOLIA\].*?(?=;)/, newLine: `_WETH[exports.ChainId.SEPOLIA] = /*#__PURE__*/new Token(exports.ChainId.SEPOLIA, '${WETH_ADDRESS}', 18, 'WETH', 'Wrapped Ether'), _WETH)`},
    ]
  );

  // sdk.esm.js
  replaceContent(
    '../forks/@uniswap/sdk/dist/sdk.esm.js',
    [
       // 修改 FACTORY_ADDRESS 与 INIT_CODE_HASH 
      {oldLine : /FACTORY_ADDRESS = '.*?'/, newLine: `FACTORY_ADDRESS = '${FACTORY_ADDRESS}'`},
      {oldLine : /INIT_CODE_HASH = '.*?'/, newLine: `INIT_CODE_HASH = '${INIT_CODE_HASH}'`},
      // 修改 WETH 地址， 注意是 ChainId.SEPOLIA
      {oldLine : /_WETH\[ChainId\.SEPOLIA\].*?(?=;)/, newLine: `_WETH[ChainId.SEPOLIA] = /*#__PURE__*/new Token(ChainId.SEPOLIA, '${WETH_ADDRESS}', 18, 'WETH', 'Wrapped Ether'), _WETH)`},
    ]
  );

  // SEPOLIA 上 Multicall 合约地址
  replaceContent(
    '../src/constants/multicall/index.ts',
    [
      // 修改 WETH 地址, 注意是 exports.ChainId.SEPOLIA
      {oldLine : /\[ChainId\.SEPOLIA\].*/, newLine: `[ChainId.SEPOLIA]: '${MULTICALL_ADDRESS}'`},
    ]
  );

  replaceContent(
    '../src/constants/v1/index.ts',
    [
      // 修改 WETH 地址, 注意是 exports.ChainId.SEPOLIA
      {oldLine : /\[ChainId\.SEPOLIA\].*/, newLine: `[ChainId.SEPOLIA]: '${FACTORY_ADDRESS}'`},
    ]
  );
}

function replaceContent(relativePath, replacements) {
  const filePath = path.resolve(__dirname, relativePath);
  let updatedContent = fs.readFileSync(filePath).toString();

  replacements.forEach(({ oldLine, newLine }) => {
    updatedContent = updatedContent.replace(oldLine, newLine);
  });

  fs.writeFileSync(filePath, updatedContent);
}

init();

