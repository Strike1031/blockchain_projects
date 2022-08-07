import Web3 from 'web3';
import { SPINNER_SHOW, CONNECT_WALLET, BUY_TOKEN, DISCONNECT_WALLET, ADD_TOKEN, UNLOCK_WCT, TOAST_SHOW } from "./actionType";
import {BINANCE_MAIN, BINANCE_TEST, MAIN_CHAINID, MAIN_WAS_ADDRESS, MAIN_WCMS_ADDRESS, MAIN_WCNS_ADDRESS, MAIN_WMRS_ADDRESS, 
    MAIN_WUS_ADDRESS, TEST_CHAINID, TEST_WAS_ADDRESS, TEST_WCMS_ADDRESS, TEST_WCNS_ADDRESS, TEST_WMRS_ADDRESS, TEST_WUS_ADDRESS,
    BINANCE_BLOCKEXPLORER_TEST, BINANCE_BLOCKEXPLORER_MAIN, MAIN_WCT_ADDRESS, TEST_WCT_ADDRESS, MAIN_TCT_ADDRESS, TEST_TCT_ADDRESS,
    MAIN_USDT_ADDRESS, TEST_USDT_ADDRESS, MAIN_SWAP_ADDRESS, TEST_SWAP_ADDRESS, fromWEI,
} from "../../constants";
import { ENV_MODE } from "../../config";
import testWasABI from '../../ABI/test/wasABI.json';
import testWcmsABI from '../../ABI/test/wasABI.json';
import testWcnsABI from '../../ABI/test/wasABI.json';       
import testWmrsABI from '../../ABI/test/wasABI.json';
import testWusABI from '../../ABI/test/wasABI.json';
import mainWasABI from '../../ABI/main/wasABI.json';
import mainWcmsABI from '../../ABI/main/wasABI.json';
import mainWcnsABI from '../../ABI/main/wasABI.json';
import mainWmrsABI from '../../ABI/main/wasABI.json';
import mainWusABI from '../../ABI/main/wasABI.json';

import swapABI from '../../ABI/test/swapABI.json';
import usdtABI from '../../ABI/test/usdtABI.json';
import tctABI from '../../ABI/test/tctABI.json';

const WAS_ADDRESS = ENV_MODE ? MAIN_WAS_ADDRESS : TEST_WAS_ADDRESS;
const WCMS_ADDRESS = ENV_MODE ? MAIN_WCMS_ADDRESS : TEST_WCMS_ADDRESS;
const WCNS_ADDRESS = ENV_MODE ? MAIN_WCNS_ADDRESS : TEST_WCNS_ADDRESS;
const WMRS_ADDRESS = ENV_MODE ? MAIN_WMRS_ADDRESS : TEST_WMRS_ADDRESS;
const WUS_ADDRESS = ENV_MODE ? MAIN_WUS_ADDRESS : TEST_WUS_ADDRESS;
const SWAP_ADDRESS = ENV_MODE ? MAIN_SWAP_ADDRESS : TEST_SWAP_ADDRESS;
const WCT_ADDRESS = ENV_MODE ? MAIN_WCT_ADDRESS : TEST_WCT_ADDRESS;
const TCT_ADDRESS = ENV_MODE ? MAIN_TCT_ADDRESS : TEST_TCT_ADDRESS;
const USDT_ADDRESS = ENV_MODE ? MAIN_USDT_ADDRESS : TEST_USDT_ADDRESS;
const BINANCE_NET = ENV_MODE ? BINANCE_MAIN : BINANCE_TEST;
const BLOCK_EXPLORER = ENV_MODE ? BINANCE_BLOCKEXPLORER_MAIN : BINANCE_BLOCKEXPLORER_TEST;
const CHAINID = ENV_MODE ? MAIN_CHAINID : TEST_CHAINID;
const CHAINNAME = ENV_MODE ? "BSC Mainnet" : "BSC Testnet";

const ARRAY_ADDRESS = [WCT_ADDRESS, TCT_ADDRESS, USDT_ADDRESS];
const NAME_ADDRESS = ['WCT', 'TCT', 'USDT'];

const wasABI = ENV_MODE ? mainWasABI : testWasABI;
const wcmsABI = ENV_MODE ? mainWcmsABI : testWcmsABI;
const wcnsABI = ENV_MODE ? mainWcnsABI : testWcnsABI;
const wmrsABI = ENV_MODE ? mainWmrsABI : testWmrsABI;
const wusABI = ENV_MODE ? mainWusABI : testWusABI;

export function simpleAction(name) {
    return {
        type: 'SIMPLE_ACTION',
        payload: name
    }
}

export function spinnerShow(show = false, message = "") {
    return (dispatch) => {
        dispatch({
            type: SPINNER_SHOW,
            payload: {
                show: show,
                message: message,
            }
        });
    };
}

const shortAddress = (address) => {
    const startStr = address.slice(0, 5);
    const lastStr = address.slice(address.length - 3, address.length);
    return (startStr + "..." + lastStr);
}

export function connectWallet() {
    return async (dispatch) => {
        if(window.ethereum === undefined || !window.ethereum.isMetaMask) {
            dispatch(disconnectWallet());
            dispatch(spinnerShow(true, "Please install metamask..."));
            return false;
        }
        
        dispatch(spinnerShow(true, "Connecting..."));
        let web3Provider;
        if (window.ethereum) {
            web3Provider = window.ethereum;
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
            } catch (error) {
                console.log("User denied account access");
                dispatch(spinnerShow(false));
                return false;
            }
        } else if (window.web3) {
            web3Provider = window.web3.currentProvider;
        } else {
            web3Provider = new Web3.providers.HttpProvider(BINANCE_NET);
        }
        const web3 = new Web3(web3Provider);
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: CHAINID }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{ chainId: CHAINID, chainName:CHAINNAME, nativeCurrency: {name: "BNB", symbol: "BNB", decimals: 18}, 
                                    rpcUrls: [BINANCE_NET], blockExplorerUrls: [BLOCK_EXPLORER]}],
                    });
                } catch (addError) {
                    // handle "add" error
                    dispatch(spinnerShow(false));
                }
            }
            else{
                dispatch(spinnerShow(false));
                return;
            }
            // handle other "switch" errors
        }

        let connectState = false;
        let connectBtnName = "";
        let account = "";
        let act = await web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                dispatch(spinnerShow(false));
                return null;
            }
            return accounts[0];
        });
        if (act != null) {
            connectState = true;
            account = act[0];
            connectBtnName = shortAddress(account);
        }

        let balanceCond = [false, false, false, false, false];
        //balance

        const wasToken = new web3.eth.Contract(wasABI, WAS_ADDRESS);
        const wcmsToken = new web3.eth.Contract(wcmsABI, WCMS_ADDRESS);
        const wcnsToken = new web3.eth.Contract(wcnsABI, WCNS_ADDRESS);
        const wmrsToken = new web3.eth.Contract(wmrsABI, WMRS_ADDRESS);
        const wusToken = new web3.eth.Contract(wusABI, WUS_ADDRESS);

        const swapToken = new web3.eth.Contract(swapABI, SWAP_ADDRESS);
        
        const tctToken = new web3.eth.Contract(tctABI, TCT_ADDRESS);
        const usdtToken = new web3.eth.Contract(usdtABI, USDT_ADDRESS);
        
        let lockedBalance = await swapToken.methods
            .lockedBalances(account)
            .call({ from: account }, function (err, res) {
                if (err) {
                    console.log("An error occured", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });
        
        let totalAirdrop = lockedBalance.totalAirdrop;
        totalAirdrop = fromWEI(totalAirdrop).toFixed(2);

        let unlockAmount = lockedBalance.unlockedAmount;
        unlockAmount = fromWEI(unlockAmount).toFixed(2);

        let lockAmount = (Number(totalAirdrop) - Number(unlockAmount)).toFixed(2);

        let userUnlock = await swapToken.methods
            .userBalances(account)
            .call({from: account}, function (err, res) {
                if (err) {
                    console.log("An error occured", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });
        let unlockAvail = userUnlock[2] !== "0" ? fromWEI(userUnlock[2]).toFixed(2) : "0";
        let unlockTime = userUnlock[3];
        if(unlockTime !== "0") {
            unlockTime = new Date(unlockTime*1000);
            unlockTime = unlockTime.toLocaleString();
        }
        else {        
            unlockTime = "-";
        }
            
        let verifyWhiteList = await swapToken.methods
            .verifyWhitelistAddress(account)
            .call({from: account}, function (err, res) {
                if (err) {
                    console.log("An error occured", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });
        
        //Get balance of USDT Token
        let usdtBalance = await usdtToken.methods
            .balanceOf(account)
            .call(function (err, res) {
                if (err) {
                    console.log("An error occured during get USDT Balance", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });

        usdtBalance = fromWEI(usdtBalance).toFixed(2);
        connectBtnName += ("( " + usdtBalance + " USDT )");

        let tctBalance = await tctToken.methods
            .balanceOf(account)
            .call(function (err, res) {
                if (err) {
                    console.log("An error occured during get TCT Balance", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });
        
        let billionVal = 10 * (1000 ** 3) * (10 ** 18);

        let billionCond = false;
        if(tctBalance > billionVal) {
            billionCond = true;
        }

        tctBalance = fromWEI(tctBalance);

        // Get balance of decks
        let balToken = [wasToken, wcmsToken, wcnsToken, wmrsToken, wusToken];
        let deckCnt = 0;
        let deckCond = true;
        for (let i = 0; i < balToken.length; i++) {
            let balance = await balToken[i].methods
                .balanceOf(account)
                .call(function (err, res) {
                    if (err) {
                        console.log("An error occured while getting number" + i + " token: " , err);
                        dispatch(spinnerShow(false));
                        return;
                    }
                    return res;
                });

            balance = fromWEI(balance);
            console.log("balance", i, balance);
            // balanceCond[i] = (balance >= 1 ? false : true);
            deckCnt = (balance >= 1 ? deckCnt + 1 : deckCnt);
        }
        if(deckCnt === 5) {
            deckCond = false;
        }

        balanceCond[0] = verifyWhiteList;
        balanceCond[1] = billionCond;
        balanceCond[2] = deckCond;

        let unlockStatus = await swapToken.methods
            .unlockStatus()
            .call(function (err, res) {
                if (err) {
                    console.log("An error occured", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });
        
        let presaleStatus = await swapToken.methods
            .presaleStatus()
            .call(function (err, res) {
                if (err) {
                    console.log("An error occured", err);
                    dispatch(spinnerShow(false));
                    return;
                }
                return res;
            });

        dispatch(spinnerShow());

        dispatch({
            type: CONNECT_WALLET,
            payload: {
                account: account,
                connectState: connectState,
                connectBtnName: connectBtnName,
                balanceCond: balanceCond,
                deckCnt: deckCnt,
                web3: web3,
                totalAirdrop: totalAirdrop,
                unlockAmount: unlockAmount,
                lockAmount: lockAmount,
                unlockAvail: unlockAvail, 
                unlockTime: unlockTime,
                tctBalance: tctBalance,
                usdtBalance: usdtBalance,
                unlockStatus: unlockStatus,
                presaleStatus: presaleStatus,
            }
        });
    };
}

export function disconnectWallet () {
    return (dispatch) => {
        dispatch({
            type: DISCONNECT_WALLET,
            payload: {
                connectState: false,
                connectBtnName: "Connect Wallet",
                totalAirdrop: "-",
                unlockAmount: "-",
                lockAmount: "-",
                unlockAvail: "-", 
            }
        })
    }
}

export function addToken(id) {
    return async (dispatch) => {
        const tokenAddress = ARRAY_ADDRESS[id];
        const tokenSymbol = NAME_ADDRESS[id];
        const tokenDecimals = 18;

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        // image: tokenImage, // A string url of the token logo
                    },
                },
            });
            if (wasAdded) {
                console.log('Thanks for your interest!');
                
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
        dispatch({
            type: ADD_TOKEN
        });
    }
}

export function buyToken (id, usdtAmount, simple) {
    return async (dispatch) => {
            const swapToken = new simple.web3.eth.Contract(swapABI, SWAP_ADDRESS);
            const usdtToken = new simple.web3.eth.Contract(usdtABI, USDT_ADDRESS); 

            let methodName = "";
            // let usdt = toWEI(usdtAmount);
            let usdt = simple.web3.utils.toWei(usdtAmount+"");

            switch(id) {
                case 0:
                    methodName = swapToken.methods.buyForWhitelist(usdt);
                    break;
                case 1:
                    methodName = swapToken.methods.buyForBillionaires(simple.account, usdt);
                    break;
                case 2:
                    methodName = swapToken.methods.buyForStarterDeck(simple.account, usdt);
                    break;
                default:
                    break;
            }

            // approve
            dispatch(spinnerShow(true, "Approving..."));
            await usdtToken.methods
            .approve(SWAP_ADDRESS, simple.web3.utils.toWei(usdtAmount+""))
            .send({ from: simple.account }, function (err, res) {
                if (err) {
                    console.log("An error occured", err);          
                    dispatch(spinnerShow());
                    return;
                }
                dispatch(spinnerShow(true, "Processing Approving..."));
                return res;
            });
            dispatch(spinnerShow(true, "Confirming Transaction..."));
            
            await methodName
                .send({from: simple.account}, function (err, res) {
                    if (err) {
                        console.log("An error occured", err);          
                        dispatch(spinnerShow());
                        return;
                    }
                    dispatch(spinnerShow(true, "Processing Transaction..."));
                    return res;
                })
                .then((res)=>{
                    let eventData = "";
                    if(id === 0) {
                        eventData = res.events.WhitelistBuy;
                    }
                    else if(id === 1) {
                        eventData = res.events.BillionairesBuy;
                    }
                    else if(id === 2) {
                        eventData = res.events.StarterDeckBuy;
                    }
                    if(eventData !== undefined || eventData !== null) {
                        dispatch(connectWallet());
                    }
                    else {
                        dispatch(spinnerShow());
                        return;
                    }
                })
            
        dispatch({
            type: BUY_TOKEN,
            payload: {
                connectState: simple.connectState,
                balanceCond: simple.balanceCond,
            }
        });
    }
}

export function unlockWCT (simple) {
    return async (dispatch) => {
        const swapToken = new simple.web3.eth.Contract(swapABI, SWAP_ADDRESS);

        await swapToken.methods
            .unlockWCT(simple.account)
            .send({from: simple.account}, function (err, res) {
                if (err) {
                    console.log("An error occured", err);          
                    dispatch(spinnerShow());
                    return;
                }
                dispatch(spinnerShow(true, "Processing Transaction..."));
                return res;
            })
            .then((res)=>{
                let eventData = res.events.unlockWCT;
                if(eventData !== undefined || eventData !== null) {
                    dispatch(connectWallet())
                }
                else {
                    dispatch(spinnerShow());
                }
            })

        dispatch({
            type: UNLOCK_WCT,
            payload: {
            }
        });
    }
}

export function toastState(_toastShow = false, _toastType = "success", _toastMessage = "") {
    return (dispatch) => {
        dispatch({
            type: TOAST_SHOW,
            payload: {
                toastShow: _toastShow,
                toastType: _toastType,
                toastMessage: _toastMessage,
            }
        });
    };
}