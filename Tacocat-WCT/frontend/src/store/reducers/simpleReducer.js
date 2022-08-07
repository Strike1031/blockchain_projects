import Web3 from "web3";
import { BUY_TOKEN, CONNECT_WALLET, DISCONNECT_WALLET, SPINNER_SHOW, ADD_TOKEN, TOAST_SHOW } from "../actions/actionType";

import WHITELIST_IMAGE from '../../images/whitelist.png';
import BILLIONARIES_IMAGE from '../../images/billionaries.png';
import STARTERDECK_IMAGE from '../../images/starterdeck.png';
import BACKGROUND_IMAGE from '../../images/background.jpg';
import BANNER from '../../images/banner.png';
import LOGO from '../../images/logo.png';
import FOOTER from '../../images/footer.jpg';

const initialState = {
  // Connect Wallet
  deckId: [0, 1, 2],
  account: "",
  connectState: false,
  connectBtnName: "Connect Wallet",
  balanceCond: [false, false, false],
  web3: Web3,
  imagePath: [
    WHITELIST_IMAGE, BILLIONARIES_IMAGE, STARTERDECK_IMAGE
  ],
  bgPath: BACKGROUND_IMAGE,
  banner: BANNER,
  logo: LOGO,
  footer: FOOTER,
  //spinner
  show: false,
  message: "",
  totalAirdrop: "-",
  unlockAmount: "-",
  lockAmount: "-",
  unlockAvail: "-",
  unlockTime: "-",
  deckCnt: 0,
  tctBalance: 0,
  usdtBalance: 0,
  toastShow: false,
  toastType: "success",
  toastMessage: "",
  unlockStatus: false,
  presaleStatus: false,
}

const simpleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SPINNER_SHOW:
      return {
        ...state,
        show: action.payload.show,
        message: action.payload.message
      }
    case CONNECT_WALLET:
      return {
        ...state,
        account: action.payload.account,
        connectState: action.payload.connectState,
        connectBtnName: action.payload.connectBtnName,
        balanceCond: action.payload.balanceCond,
        web3: action.payload.web3,
        totalAirdrop: action.payload.totalAirdrop,
        unlockAmount: action.payload.unlockAmount,
        lockAmount: action.payload.lockAmount,
        unlockAvail: action.payload.unlockAvail, 
        unlockTime: action.payload.unlockTime,
        deckCnt: action.payload.deckCnt,
        tctBalance: action.payload.tctBalance,
        usdtBalance: action.payload.usdtBalance,
        unlockStatus: action.payload.unlockStatus,
        presaleStatus: action.payload.presaleStatus,
      }
    case DISCONNECT_WALLET:
      return {
        ...state,
        connectState: false,
        connectBtnName: "Connect Wallet",
        totalAirdrop: "-",
        unlockAmount: "-",
        lockAmount: "-",
        unlockAvail: "-",
        unlockTime: "-",
        deckCnt: 0,
        tctBalance: 0,
        usdtBalance: 0,
        unlockStatus: false,
        presaleStatus: false,
      }
    case BUY_TOKEN:
      return {
        ...state,
        balanceCond: action.payload.balanceCond,
        connectState: action.payload.connectState,
      }
    case ADD_TOKEN:
      return;
    case TOAST_SHOW:
      return {
        ...state,
        toastShow: action.payload.toastShow,
        toastType: action.payload.toastType,
        toastMessage: action.payload.toastMessage,
      }
    default:
      return state
    }
  }


export default simpleReducer;