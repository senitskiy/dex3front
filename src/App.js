import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Redirect, useLocation, useHistory} from 'react-router-dom';
import {changeTheme, setCurExt, setExtensionsList, setWalletIsConnected, showPopup} from './store/actions/app';
import {setLiquidityList, setPairsList, setPubKey, setSubscribeData, setTokenList, setTransactionsList, setWallet} from './store/actions/wallet';
import { getAllClientWallets, getAllPairsWoithoutProvider, getClientBalance,checkPubKey, subscribe,checkClientPairExists } from './extensions/webhook/script';
import { checkExtensions, getCurrentExtension } from './extensions/extensions/checkExtensions';
import {
    setSwapAsyncIsWaiting,
    setSwapFromInputValue,
    setSwapFromInputValueChange,
    setSwapFromToken,
    setSwapToInputValue,
    setSwapToToken
} from './store/actions/swap';
import { setPoolAsyncIsWaiting, setPoolFromInputValue, setPoolFromToken, setPoolToInputValue, setPoolToToken } from './store/actions/pool';
import { setManageAsyncIsWaiting, setManageBalance, setManageFromToken, setManagePairId, setManageRateAB, setManageRateBA, setManageToToken } from './store/actions/manage';
import Account from './pages/Account/Account';
import Swap from './pages/Swap/Swap';
import Pool from './pages/Pool/Pool';
import Popup from './components/Popup/Popup';
import Header from './components/Header/Header'
import Manage from './pages/Manage/Manage';
import AddLiquidity from './pages/AddLiquidity/AddLiquidity';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const popup = useSelector(state => state.appReducer.popup);
  const appTheme = useSelector(state => state.appReducer.appTheme);
  const pubKey = useSelector(state => state.walletReducer.pubKey);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const swapAsyncIsWaiting = useSelector(state => state.swapReducer.swapAsyncIsWaiting);
  const transactionsList = useSelector(state => state.walletReducer.transactionsList);
  const poolAsyncIsWaiting = useSelector(state => state.poolReducer.poolAsyncIsWaiting);
  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const liquidityList = useSelector(state => state.walletReducer.liquidityList);


const [onloading,setonloading] = useState(false)
  const manageAsyncIsWaiting = useSelector(state => state.manageReducer.manageAsyncIsWaiting);
  const subscribeData = useSelector(state => state.walletReducer.subscribeData);
  const curExt = useSelector(state => state.appReducer.curExt);

  const chrome = localStorage.getItem("chrome");
  if(chrome === null) showChromePopup();
  else if(chrome === "false") showChromePopup();

  function showChromePopup() {
    dispatch(showPopup({type: 'chrome'}));
    localStorage.setItem("chrome", "true");
  }

  useEffect(async () => {
      setonloading(true)
    const theme = localStorage.getItem('appTheme') === null ? 'light' : localStorage.getItem('appTheme');
    if(appTheme !== theme) dispatch(changeTheme(theme));

    const extensionsList = await checkExtensions();

    dispatch(setExtensionsList(extensionsList));





    const curExtname = localStorage.getItem('extName') === null ? {} : localStorage.getItem('extName');
    let curExtt = await getCurrentExtension(curExtname)


    console.log("curExtt",curExtt._extLib.pubkey)

      const pubKey2 = await checkPubKey(curExtt._extLib.pubkey)



      if(!pubKey2.status){
          setonloading(false)
          return
      }
console.log("pubKey2",pubKey2)
    if(pubKey2.status){
      dispatch(setPubKey(pubKey2));
      // history.push("/Account")
        dispatch(setCurExt(curExtt));
    }


    const wallet =
        // localStorage.getItem('wallet') === null ?
        {
          id:pubKey2.dexclient,
          balance:await getClientBalance(pubKey2.dexclient)
        }
        // :
        // JSON.parse(localStorage.getItem('wallet'));

    if(wallet.id) {
      dispatch(setWallet(wallet));
      dispatch(setWalletIsConnected(true));
    }
    const pairs = await getAllPairsWoithoutProvider();

    let arrPairs = [];
    await pairs.map(async item=>{
      item.exists = await checkClientPairExists(pubKey2.dexclient, item.pairAddress)
      arrPairs.push(item)
    })
    dispatch(setPairsList(arrPairs));





    // const tokenList = getAllClientWallets(pubKey.address)

    // const tokenList = localStorage.getItem('tokenList') === null ? tokenList : JSON.parse(localStorage.getItem('tokenList'));


    let tokenList = await getAllClientWallets(pubKey2.dexclient);
    console.log("tokenList",tokenList)
    let liquidityList = [];
    // console.log('token list',tokenList,"pubKey.address",pubKey.address);
    if(tokenList.length) {
      tokenList.forEach(async item => await subscribe(item.walletAddress));

      liquidityList = tokenList.filter(i => i.symbol.includes('/'));

      tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
          {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
          })
      );
      localStorage.setItem('tokenList', JSON.stringify(tokenList));
      localStorage.setItem('liquidityList', JSON.stringify(liquidityList));
      dispatch(setTokenList(tokenList));
      dispatch(setLiquidityList(liquidityList));
    }
//TODO
    const transactionsList = localStorage.getItem('transactionsList') === null ? [] : JSON.parse(localStorage.getItem('transactionsList'));
    if(transactionsList.length) dispatch(setTransactionsList(transactionsList));

      setonloading(false)
      console.log("setonloading",onloading)
  }, []);



  useEffect(() => {
    window.addEventListener('beforeunload', function(e) {
      if(swapAsyncIsWaiting || poolAsyncIsWaiting || manageAsyncIsWaiting) e.returnValue = ''
    })
  }, [swapAsyncIsWaiting, poolAsyncIsWaiting, manageAsyncIsWaiting]);

  useEffect(async () => {
      // setonloading(true)
    if(subscribeData.dst) {
      const clientBalance = await getClientBalance(pubKey.address);
console.log("clientBalanceAT WEBHOOK",clientBalance,"pubKey.dexclient",pubKey.address)
      let item = localStorage.getItem("currentElement");
      if(transactionsList[item]) transactionsList[item].toValue = subscribeData.amountOfTokens / 1e9;
      if (transactionsList.length) dispatch(setTransactionsList(transactionsList));
      dispatch(setWallet({id: pubKey.address, balance: clientBalance}));
      let tokenList = await getAllClientWallets(pubKey.address);
      console.log("tokenList after WEBH",tokenList)
      let liquidityList = [];
      if(tokenList.length) {
        tokenList.forEach(async item => await subscribe(item.walletAddress));

        liquidityList = tokenList.filter(i => i.symbol.includes('/'));

        tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
          {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
          })
        );
          localStorage.setItem('tokenList', JSON.stringify(tokenList));
          localStorage.setItem('liquidityList', JSON.stringify(liquidityList));
        dispatch(setTokenList(tokenList));
        dispatch(setLiquidityList(liquidityList));
      }

      if(swapAsyncIsWaiting) {
        dispatch(showPopup({type: 'success', link: subscribeData.transactionID}));
        dispatch(setSwapFromToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setSwapToToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setSwapFromInputValue(0));
        dispatch(setSwapToInputValue(0));
        dispatch(setSwapAsyncIsWaiting(false));
          dispatch(setSwapFromInputValueChange(0));
      } else if(poolAsyncIsWaiting) {
        dispatch(showPopup({type: 'success', link: subscribeData.transactionID}));
        dispatch(setPoolFromToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setPoolToToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setPoolFromInputValue(0));
        dispatch(setPoolToInputValue(0));
        dispatch(setPoolAsyncIsWaiting(false));
      } else if(manageAsyncIsWaiting) {
        dispatch(showPopup({type: 'success', link: subscribeData.transactionID}));
        dispatch(setManageFromToken({
          symbol: '',
          reserve: 0
        }));
        dispatch(setManageToToken({
          symbol: '',
          reserve: 0
        }));
        dispatch(setManageBalance(0));
        dispatch(setManagePairId(''));
        dispatch(setManageRateAB(0));
        dispatch(setManageRateBA(0));
        dispatch(setManageAsyncIsWaiting(false));
        history.push('/pool')
      }
    }
      // setonloading(false)
  }, [subscribeData]);

  return (
    <>
        {onloading && <div className="blockDiv"></div>}
      <div className="beta">Beta version. Use desktop Google Chrome</div>
      <Header />
      <Switch location={location}>
        <Route path="/account" component={Account} />
        <Route path="/swap" component={Swap} />
        <Route path="/pool"  component={Pool} />
        <Route path="/add-liquidity" component={AddLiquidity} />
        <Route path="/manage" render={() => !walletIsConnected ? <Redirect to="/pool" /> : <Manage />} />
        <Redirect from="" to="/swap" />
      </Switch>

      {popup.isVisible && <Popup type={popup.type} message={popup.message} link={popup.link} />}
    </>
  );
}

export default App;
