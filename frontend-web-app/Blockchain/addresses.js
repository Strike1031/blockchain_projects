import ChainID from "./chainId";

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const MockUSDC = {
  [ChainID.ethereum]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [ChainID.rinkeby]: "0x7543923063e9BbeAa21cd5e993895Be98593558a",
  [ChainID.avalanche]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  [ChainID.fuji]: "0x9F37267130a0cE8d381e678Afd75b32463c6f5B6",
  [ChainID.polygon]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  [ChainID.mumbai]: "0x9561624667eEa5759889Ea413923f81D04752fE8",
  [ChainID.arbitrum]: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  [ChainID["arbitrum-rinkeby"]]: "0x463d55d6416a7CCa1f7C005a6AC8f0dD70a6f410",
  [ChainID.binance]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  [ChainID["bsc-testnet"]]: "0x9723cec49ad6e6A170fDDf96f9A31eE3aBAECC8B",
  [ChainID.fantom]: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  [ChainID["fantom-testnet"]]: "0xEFf376D41EE191A556bcdf77aCb9c9453F7F7789",
  [ChainID.optimism]: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  [ChainID["optimism-kovan"]]: "0x463d55d6416a7CCa1f7C005a6AC8f0dD70a6f410",
};

export const PozzlenautsONFT = {
  [ChainID.ethereum]: "0xA11937C76F8569fC47fe2D7d3EB80288812Ef380",
  [ChainID.rinkeby]: "0xBb2A1dE0D1ea4D6b55B267600e598904DC8a5215",
  [ChainID.avalanche]: "0xA11937C76F8569fC47fe2D7d3EB80288812Ef380",
  [ChainID.fuji]: "0x1171D103c0d7783A5bfFC241539f27F1B51A54e0",
  [ChainID.polygon]: "0xA11937C76F8569fC47fe2D7d3EB80288812Ef380",
  [ChainID.mumbai]: "0xbAEc9DF7dbEc17d8520182608E10dAC006DfB8f4",
  [ChainID.arbitrum]: "0xA11937C76F8569fC47fe2D7d3EB80288812Ef380",
  [ChainID["arbitrum-rinkeby"]]: "0xfC16ce1682F5c135590F894650bd1cDDD0c56221",
  [ChainID.binance]: "0xA11937C76F8569fC47fe2D7d3EB80288812Ef380",
  [ChainID["bsc-testnet"]]: "0x5FCe23d238Ee4134Dc3f40594A54B8a2713AB09d",
  [ChainID.fantom]: nullAddress,
  [ChainID["fantom-testnet"]]: nullAddress,
  [ChainID.optimism]: "0x667F965913e10Ad3f1B4804954a814581359251F",
  [ChainID["optimism-kovan"]]: "0xfC16ce1682F5c135590F894650bd1cDDD0c56221",
};

export const RPC_SERVER = {
  [ChainID.ethereum]: "https://rpc.ankr.com/eth",
  [ChainID.rinkeby]:
    "https://rinkeby.infura.io/v3/061fa1c0fcdf47d085cb989ebb594b5d",
  [ChainID.avalanche]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainID.fuji]: "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainID.polygon]: "https://polygon-rpc.com",
  // [ChainID.polygon]:
  //   "https://polygon-mainnet.g.alchemy.com/v2/IGL7GP-wG8NTRiTADT4XWmHNn3dbjs0S",
  [ChainID.mumbai]: "https://matic-mumbai.chainstacklabs.com",
  [ChainID.arbitrum]: "https://arb1.arbitrum.io/rpc",
  [ChainID["arbitrum-rinkeby"]]: "https://rinkeby.arbitrum.io/rpc",
  [ChainID.binance]: "https://rpc-bsc.bnb48.club",
  [ChainID["bsc-testnet"]]: "https://data-seed-prebsc-1-s3.binance.org:8545",
  [ChainID.fantom]: "https://rpcapi.fantom.network",
  [ChainID["fantom-testnet"]]: "https://rpc.testnet.fantom.network",
  [ChainID.optimism]: "https://mainnet.optimism.io",
  [ChainID["optimism-kovan"]]: "https://kovan.optimism.io/",
};
