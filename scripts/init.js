const path = require("path");
const fs = require("fs");

function init() {

  // 原来的地址
  const ORIGIN_INIT_CODE_HASH = "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
  const ORIGIN_FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const ORIGIN_ROUTER02 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const ORIGIN_ROUTER01 = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";

  // 新地址
  const INIT_CODE_HASH = "";
  const FACTORY = "";
  const ROUTER02 = "";
  const ROUTER01 = "";
  const WETH_ADDRESS = "";

  // 将 ROUTER_ADDRESS 修改为 UniswapV2Router02 地址
  replaceContent(
    "../src/constants/index.ts",
    [
      {oldLine : /ROUTER_ADDRESS = '.*?'/, newLine: `ROUTER_ADDRESS = "${ROUTER02}"`},
    ]
  );

  // 文件中 BAD_RECIPIENT_ADDRESSES 数组的值修改为 UniswapV2Factory、UniswapV2Router01、UniswapV2Router02
  replaceContent(
    "../src/state/swap/hooks.ts",
    [
      {oldLine : /.*\/\/\s*v2 factory/,   newLine: `  '${FACTORY}', // v2 factory`},
      {oldLine : /.*\/\/\s*v2 router 01/, newLine: `  '${ROUTER01}', // v2 router 01`},
      {oldLine : /.*\/\/\s*v2 router 02/, newLine: `  '${ROUTER02}' // v2 router 02`},
    ]
  );
  
  //// 修改下面三个文件

  // constants.d.ts
  replaceContent(
    "../forks/@uniswap/sdk/dist/constants.d.ts",
    [
      // 修改 FACTORY_ADDRESS 与 INIT_CODE_HASH 
      {oldLine : /FACTORY_ADDRESS = '.*?'/, newLine: `FACTORY_ADDRESS = "${FACTORY}"`},
      {oldLine : /INIT_CODE_HASH = '.*?'/, newLine: `INIT_CODE_HASH = "${INIT_CODE_HASH}"`},
    ]
  );

  // sdk.cjs.development.js
  replaceContent(
    "../forks/@uniswap/sdk/dist/sdk.cjs.development.js",
    [
       // 修改 FACTORY_ADDRESS 与 INIT_CODE_HASH 
      {oldLine : /FACTORY_ADDRESS = '.*?'/, newLine: `FACTORY_ADDRESS = "${FACTORY}"`},
      {oldLine : /INIT_CODE_HASH = '.*?'/, newLine: `INIT_CODE_HASH = "${INIT_CODE_HASH}"`},
      // 修改 WETH 地址, 注意是 exports.ChainId.SEPOLIA
      {oldLine : /_WETH\[exports\.ChainId\.SEPOLIA\].*?(?=;)/, newLine: `_WETH[ChainId.SEPOLIA] = /*#__PURE__*/new Token(ChainId.SEPOLIA, '${WETH_ADDRESS}', 18, 'WETH', 'Wrapped Ether'), _WETH)`},
    ]
  );

  // sdk.esm.js
  replaceContent(
    "../forks/@uniswap/sdk/dist/sdk.esm.js",
    [
       // 修改 FACTORY_ADDRESS 与 INIT_CODE_HASH 
      {oldLine : /FACTORY_ADDRESS = '.*?'/, newLine: `FACTORY_ADDRESS = "${FACTORY}"`},
      {oldLine : /INIT_CODE_HASH = '.*?'/, newLine: `INIT_CODE_HASH = "${INIT_CODE_HASH}"`},
      // 修改 WETH 地址， 注意是 ChainId.SEPOLIA
      {oldLine : /_WETH\[ChainId\.SEPOLIA\].*?(?=;)/, newLine: `_WETH[exports.ChainId.SEPOLIA] = /*#__PURE__*/new Token(exports.ChainId.SEPOLIA, '${WETH_ADDRESS}', 18, 'WETH', 'Wrapped Ether'), _WETH)`},
    ]
  );

  // SEPOLIA 上 Multicall 合约地址
  replaceContent(
    "../src/constants/multicall/index.ts",
    [
      // 修改 WETH 地址, 注意是 exports.ChainId.SEPOLIA
      {oldLine : /\[ChainId\.SEPOLIA\].*/, newLine: `[ChainId.SEPOLIA]: '0x25Eef291876194AeF123Ad0D60Dff89e268b90754Bb'`},
    ]
  );

  replaceContent(
    "../src/constants/v1/index.ts",
    [
      // 修改 WETH 地址, 注意是 exports.ChainId.SEPOLIA
      {oldLine : /\[ChainId\.SEPOLIA\].*/, newLine: `[ChainId.SEPOLIA]: '${FACTORY}'`},
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

