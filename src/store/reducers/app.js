import {
  CHANGE_THEME,
  SET_EXTENSIONS_LIST,
  SET_CUR_EXT,
  CONNECT_WALLET,
  SET_WALLET_IS_CONNECTED,
  CLOSE_CONNECTING,
  SHOW_POPUP,
  HIDE_POPUP,
} from '../actions/types';

const initialState = {
  appTheme: null,
  extensionsList: [],
  extensionIsSelected: false,
  curExt: {},
  walletIsConnected: false,
  connectingWallet: false,
  accountIsVisible: false,
  popup: {isVisible: false, type: '', message: '', link: ''},
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHANGE_THEME:
      return {
        ...state,
        appTheme: payload
      }
    case SET_EXTENSIONS_LIST: 
      return {
        ...state,
        extensionsList: payload
      }
    case SET_CUR_EXT: 
      return {
        ...state,
        curExt: payload,
        extensionIsSelected: payload._extLib ? true : false
      }
    case CONNECT_WALLET: 
      return {
        ...state,
        connectingWallet: true
      }
    case CLOSE_CONNECTING: 
      return {
        ...state,
        connectingWallet: false
      }
    case SET_WALLET_IS_CONNECTED: 
      return {
        ...state,
        walletIsConnected: payload
      }
    case SHOW_POPUP: 
      return {
        ...state,
        popup: {isVisible: true, type: payload.type, message: payload.message, link: payload.link}
      }
    case HIDE_POPUP: 
      return {
        ...state,
        popup: {isVisible: false, type: '', message: '', link: ''}
      }
    default:
      return state;
  }
};

export default appReducer;