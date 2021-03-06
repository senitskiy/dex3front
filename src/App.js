import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Redirect, useLocation, useHistory} from 'react-router-dom';
import {changeTheme, setCurExt, setExtensionsList, setWalletIsConnected, showPopup} from './store/actions/app';
import {setLiquidityList, setPairsList, setPubKey, setSubscribeData, setTokenList, setTransactionsList, setWallet} from './store/actions/wallet';
import {
    getAllClientWallets,
    getAllPairsWoithoutProvider,
    getClientBalance,
    checkPubKey,
    subscribe,
    checkClientPairExists,
    checkwalletExists,
    subscribeClient, checkSouint
} from './extensions/webhook/script';
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
      console.log("extensionsList",extensionsList)
    dispatch(setExtensionsList(extensionsList));

      let extensionsListBothNotAvaile = extensionsList.filter(item=>item.available === true)

      console.log("extensionsListBothNotAvaile",extensionsListBothNotAvaile)
      if(extensionsListBothNotAvaile.length === 0){
          const pairs = await getAllPairsWoithoutProvider();

          dispatch(setPairsList(pairs));
          setonloading(false)
          return
      }

      let extFromLocalisAVail = extensionsListBothNotAvaile.filter(item=>item.name===localStorage.getItem('extName'))
      let extFromLocalisAVail2 = extensionsListBothNotAvaile.filter(item=>item.name!==localStorage.getItem('extName'))
      console.log("extFromLocalisAVail",extFromLocalisAVail)


// console.log((localStorage.getItem('extName') === null || !localStorage.getItem('extName').length))
    const curExtname = (localStorage.getItem('extName') === null || !localStorage.getItem('extName').length) ? extensionsListBothNotAvaile[0].name : (extFromLocalisAVail.length ? localStorage.getItem('extName') : extFromLocalisAVail2[0].length);
    let curExtt = await getCurrentExtension(curExtname)
    const pubKey2 = await checkPubKey(curExtt._extLib.pubkey)



      if(!pubKey2.status){
          setonloading(false)
          return
      }

    if(pubKey2.status){
      dispatch(setPubKey(pubKey2));
      dispatch(setCurExt(curExtt));
        subscribeClient(pubKey2.dexclient)
    }
      // checkSouint(pubKey2.dexclient)

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
      item.walletExists = await checkwalletExists(pubKey2.dexclient, item.pairAddress)

      arrPairs.push(item)
    })
      console.log("pairspairspairs",pairs)
    dispatch(setPairsList(arrPairs));





    // const tokenList = getAllClientWallets(pubKey.address)

    // const tokenList = localStorage.getItem('tokenList') === null ? tokenList : JSON.parse(localStorage.getItem('tokenList'));


    let tokenList = await getAllClientWallets(pubKey2.dexclient);
    console.log("tokenList",tokenList)
    let liquidityList = [];
    // console.log('token list',tokenList,"pubKey.address",pubKey.address);
    if(tokenList.length) {
        console.log("tokenList",tokenList)



        tokenList.forEach(async item => await subscribe(item.walletAddress));

      liquidityList = tokenList.filter(i => i.symbol.includes('/'));

      tokenList = tokenList.filter(i => !i.symbol.includes('/'))
      //localStorage.setItem('tokenList', JSON.stringify(tokenList));
      //localStorage.setItem('liquidityList', JSON.stringify(liquidityList));
      dispatch(setTokenList(tokenList));
      dispatch(setLiquidityList(liquidityList));
    }
//TODO
//     const transactionsList = localStorage.getItem('transactionsList') === null ? {} : JSON.parse(localStorage.getItem('transactionsList'));
//     if(transactionsList.length) dispatch(setTransactionsList(transactionsList));

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
        const pubKey2 = await checkPubKey(curExt._extLib.pubkey)
      const clientBalance = await getClientBalance(pubKey2.dexclient);
console.log("clientBalanceAT WEBHOOK",clientBalance,"pubKey.dexclient",pubKey2.dexclient)
      let item = localStorage.getItem("currentElement");
        let lastTransactioType = localStorage.getItem("lastType");

        if(lastTransactioType === "swap") {
            console.log("item", item, "subscribeData swap", subscribeData, typeof subscribeData.amountOfTokens)
            if (transactionsList[item]) transactionsList[item].toValue = (Number(subscribeData.amountOfTokens / 1e9));
            if (transactionsList.length) dispatch(setTransactionsList(transactionsList));
        }
        if(lastTransactioType === "processLiquidity") {
            console.log("item", item, "subscribeData processLiquidity", subscribeData)
            if (transactionsList[item]) transactionsList[item].lpTokens = (Number(subscribeData.amountOfTokens / 1e9)).toFixed(Number(subscribeData.amountOfTokens / 1e9) <0.0001 ? 6 : 4);
            if (transactionsList.length) dispatch(setTransactionsList(transactionsList));
        }

        if(subscribeData.name === "connectCallback") {
            console.log("subscribeData at collback", subscribeData)
            const pairs = await getAllPairsWoithoutProvider();

            let arrPairs = [];
            await pairs.map(async item=>{
                item.exists = await checkClientPairExists(pubKey2.dexclient, item.pairAddress)
                item.walletExists = await checkwalletExists(pubKey2.dexclient, item.pairAddress)
                arrPairs.push(item)
            })
            console.log("pairspairspairs",pairs)
            dispatch(setPairsList(arrPairs));

            let liquidityList = [];
            let tokenList = await getAllClientWallets(pubKey.address);
                if (tokenList.length) {
                    tokenList.forEach(async item => await subscribe(item.walletAddress));

                    liquidityList = tokenList.filter(i => i.symbol.includes('/'));

                    tokenList = tokenList.filter(i => !i.symbol.includes('/'))
                    dispatch(setTokenList(tokenList));
                    dispatch(setLiquidityList(liquidityList));
                }
        }
        if(subscribeData.name === "accept") {
            const pairs = await getAllPairsWoithoutProvider();
            let arrPairs = [];
            await pairs.map(async item=>{
                item.exists = await checkClientPairExists(pubKey2.dexclient, item.pairAddress)
                item.walletExists = await checkwalletExists(pubKey2.dexclient, item.pairAddress)
                arrPairs.push(item)
            })
            console.log("pairspairspairs",pairs)
            dispatch(setPairsList(arrPairs));
        }

      dispatch(setWallet({id: pubKey.address, balance: clientBalance}));
        subscribeClient(pubKey2.dexclient)


        // const pairs = await getAllPairsWoithoutProvider();
        // let arrPairs = [];
        // await pairs.map(async item=>{
        //     item.exists = await checkClientPairExists(pubKey.address, item.pairAddress)
        //     item.walletExists = await checkwalletExists(pubKey.address, item.pairAddress)
        //
        //     arrPairs.push(item)
        // })
        // console.log("pairspairspairs",pairs)
        // dispatch(setPairsList(arrPairs));

      let tokenList = await getAllClientWallets(pubKey.address);
      console.log("tokenList after WEBH",tokenList)
      let liquidityList = [];
      console.log(9999395394583590, tokenList)
      if(tokenList.length) {

          tokenList.forEach(async item => await subscribe(item.walletAddress));

        liquidityList = tokenList.filter(i => i.symbol.includes('/'));

        tokenList = tokenList.filter(i => !i.symbol.includes('/'))
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
        history.push("/pool")
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
