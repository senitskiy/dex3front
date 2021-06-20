import { combineReducers } from "redux";
import appReducer from "./app";
import walletReducer from "./wallet";
import poolReducer from "./pool";
import swapReducer from "./swap";

import manageReducer from "./manage";
import clientWallets from "./clientWallets";
import poolExplorer from "./poolExplorer";

export default combineReducers({
  appReducer,
  walletReducer,
  swapReducer,
  poolReducer,
  manageReducer,
  clientWallets,
  poolExplorer

});
