import BigNumber from "bignumber.js";

//mainnet address
export const MAIN_WAS_ADDRESS = "0x06D8e34c4D2eA294cBEBF8F459a9687EBeb80aa0";
export const MAIN_WCMS_ADDRESS = "0xabB56A04BF6E174383A5ef897573e44B6c4B7bC1";
export const MAIN_WCNS_ADDRESS = "0xf36a695000F8a0a3faa28d044a894E62328A5e15";
export const MAIN_WMRS_ADDRESS = "0xaf471Dc597F303cbB11e24b6D9B83663d33232ca";
export const MAIN_WUS_ADDRESS = "0xd6ac22b7616377F06a8D736Ed5d0e2897F430553";

export const MAIN_WCT_ADDRESS = "0x9C02114C62Edd9a3DaDDCe6c4f1cCc8e780A2486";
export const MAIN_TCT_ADDRESS = "0xb036f689bd98b4bd3bd648fa09a23e54d839a859";
export const MAIN_USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
export const MAIN_SWAP_ADDRESS = "0x279108c0b7171f8640dc29E37a3f388fD99AD385";

//testnet address
export const TEST_WAS_ADDRESS = "0x80cF5a3FcF9b2c773f97fe14722Ce6B33d79a58a";
export const TEST_WCMS_ADDRESS = "0x850eb5F17dc5e5005445267B8FDFB61ab1CDa89e";
export const TEST_WCNS_ADDRESS = "0x7da20E3C271F9a3f77C7307f3557B0704491ff60";
export const TEST_WMRS_ADDRESS = "0x195037f8dd1dcD4b8063Cb933e3a4F5c9Db9114E";
export const TEST_WUS_ADDRESS = "0x963b460f2A3ba15563182CbFd1240F846C56eD49";

export const TEST_WCT_ADDRESS = "0x531eBDb4337c038BdE84EF83080070A7c8214637";
export const TEST_TCT_ADDRESS = "0xd8A02554Ae4Ad03834e3209F07c8546d780963a9";
export const TEST_USDT_ADDRESS = "0x5bc90ba0CCA26FA03a6E37812b31e4350610be72";
export const TEST_SWAP_ADDRESS = "0x5D4BC338Ca396f98Bcc9A680f6831c106B9Baf6D";

export const BINANCE_TEST = "https://data-seed-prebsc-1-s1.binance.org:8545/";
export const BINANCE_MAIN = "https://bsc-dataseed.binance.org/";
export const BINANCE_BLOCKEXPLORER_TEST = "https://testnet.bscscan.com/";
export const BINANCE_BLOCKEXPLORER_MAIN = "https://bscscan.com/";
export const TEST_CHAINID = "0x61";
export const MAIN_CHAINID = "0x38";

export const DECIMAL = 18;

export function toWEI(number){
    return BigNumber(number).shiftedBy(DECIMAL);
}

export function fromWEI(number){
    return BigNumber(number).shiftedBy(-1 * DECIMAL).toNumber();
}