import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {showPopup} from '../../store/actions/app';
import MainBlock from './../../components/MainBlock/MainBlock';
import Input from './../../components/Input/Input';
import SwapBtn from '../../components/SwapBtn/SwapBtn';
import SwapConfirmPopup from '../../components/SwapConfirmPopup/SwapConfirmPopup';
import WaitingPopup from '../../components/WaitingPopup/WaitingPopup';
import WaitingPopupConnect from '../../components/WaitingPopupConnect/WaitingPopupConnectConnect';
import './Swap.scss';
import {
    connectToPair,
    connectToPairDeployWallets,
    connectToPairStep2DeployWallets,
    getClientForConnect,
    setCreator
} from "../../extensions/sdk/run"
import {checkClientPairExists, getAllClientWallets, subscribe} from "../../extensions/webhook/script";
import {setLiquidityList, setTokenList} from "../../store/actions/wallet";
import {setSwapAsyncIsWaiting} from "../../store/actions/swap";

function Swap () {
  const history = useHistory();
  const dispatch = useDispatch();

  const connectingWallet = useSelector(state => state.appReducer.connectingWallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const accountIsVisible = useSelector(state => state.appReducer.accountIsVisible);


  let curExt = useSelector(state => state.appReducer.curExt);
  let pubKey = useSelector(state => state.walletReducer.pubKey);


  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const pairsList = useSelector(state => state.walletReducer.pairsList);

  const fromToken = useSelector(state => state.swapReducer.fromToken);
  const toToken = useSelector(state => state.swapReducer.toToken);

  const fromValue = useSelector(state => state.swapReducer.fromInputValue);
  console.log("fromValue",fromValue)
  const toValue = useSelector(state => state.swapReducer.toInputValue);
  const pairId = useSelector(state => state.swapReducer.pairId);
  const swapAsyncIsWaiting = useSelector(state => state.swapReducer.swapAsyncIsWaiting);
  const [swapConfirmPopupIsVisible, setSwapConfirmPopupIsVisible] = useState(false);

    const [connectAsyncIsWaiting, setconnectAsyncIsWaiting] = useState(false);
  const [curExist, setExistsPair] = useState(false);
    // const [curPia, setCurrentPair] = useState([]);
    const [notDeployedWallets, setNotDeployedWallets] = useState([]);
    const [connectPairStatusText, setconnectPairStatusText] = useState("");

  useEffect(()=>{
if(!pairsList.length || !pairId){
  // console.log("pairsList CKECK 0",pairsList)
  return
}
      // if(!curePairData || !curePairData[0])return
   let curePairData = pairsList && pairsList.filter(item=>item.pairAddress===pairId)
      console.log("pairsList CKECK 0",curePairData)
    setExistsPair(curePairData[0].exists ? curePairData[0].exists : false)
      // setCurrentPair(curePairData)

    //  if(!curePairData || !curePairData[0])return
    //  let walExists = curePairData[0].walletExists.filter(item=>item.status===false)
    // setNotDeployedWallets(walExists)

    // console.log("walExists",walExists)

  },[pairId])


    useEffect(()=>{
        if(!pairsList || !pairId){
            // console.log("pairsList CKECK 0",pairsList)
            return
        }
        let curePairData = pairsList.filter(item=>item.pairAddress===pairId)
        // console.log("curePairData",curePairData)

        if(!curePairData || !curePairData[0])return
        if(curePairData[0].walletExists) {
            let walExists = curePairData[0].walletExists.filter(item => item.status === false)
            setNotDeployedWallets(walExists)
        }


    },[toToken,tokenList,pairId])



  const rate = useSelector(state => state.swapReducer.rate);

    const [incorrectBalance,setincorrectBalance] = useState(false)

  function handleConfirm() {
    if(fromValue > fromToken.balance){
        // console.log("return",fromValue, "____", fromToken.balance)
        setincorrectBalance(true)
        setTimeout(() => setincorrectBalance(false), 200);
        return
    }

    if(fromToken.symbol && toToken.symbol && fromValue) {
      // if(fromValue > fromToken.balance ) {
      //   dispatch(showPopup({type: 'error', message: 'Excess of balance'}));
      //   return;
      // }


      setSwapConfirmPopupIsVisible(true);
    } else {
      dispatch(showPopup({type: 'error', message: 'Fields should not be empty'}));
    }
  }
  async function handleConnectPair() {
      // console.log("22",curExist)

      // console.log("notDeployedWallets",notDeployedWallets)

    setconnectAsyncIsWaiting(true);
      setconnectPairStatusText("getting data from pair.")
        let connectRes = await connectToPair(curExt, pairId);

      console.log("connectRes",connectRes)
      if(!connectRes || (connectRes && (connectRes.code === 1000 || connectRes.code === 3 || connectRes.code === 2))){
          // console.log("connectRes",connectRes)
          setconnectAsyncIsWaiting(false);
            return
      }else{
          setconnectPairStatusText("preparing client data.")
          let getClientForConnectStatus = await getClientForConnect(connectRes)
          console.log("getClientForConnectStatus",getClientForConnectStatus)
            if(getClientForConnectStatus.code){
                    setconnectAsyncIsWaiting(false);
                    return
            }else{
                setconnectPairStatusText("computing the best shard for your wallets and deploying.")
                let connectToRootsStatus = await connectToPairStep2DeployWallets(getClientForConnectStatus)
                console.log("connectToRootsStatus",connectToRootsStatus)
                if(connectToRootsStatus.code){
                    setconnectAsyncIsWaiting(false);
                    return
                }
//                 else{
//                     // return {newArr:newArr,clientAdr:clientAdr,targetShard:targetShard,clientContract:clientContract,callMethod:callMethod}
//                     let connectedItem = []
//                     connectToRootsStatus.newArr.map(async (item,i)=> {
//                         connectedItem.push(await connectToPairDeployWallets(connectToRootsStatus,item))
//                     })
// console.log("connectedItem-----------------",connectedItem)
//                 }
            }



      }



      setconnectPairStatusText("finishing")


      //     let tokenList = await getAllClientWallets(pubKey.address);
      // // tokenList.forEach(async item => await subscribe(item.walletAddress));
      //     let countT = tokenList.length
      //     let y = 0
      //     while (tokenList.length < countT) {
      //
      //         tokenList = await getAllClientWallets(pubKey.address);
      //         y++
      //         if (y > 500) {
      //             dispatch(showPopup({
      //                 type: 'error',
      //                 message: 'Oops, too much time for deploying. Please connect your wallet again.'
      //             }));
      //         }
      //     }
      //
      //     dispatch(setTokenList(tokenList));
      //
      //
      //     let liquidityList = [];
      //
      //     if (tokenList.length) {
      //         tokenList.forEach(async item => await subscribe(item.walletAddress));
      //
      //         liquidityList = tokenList.filter(i => i.symbol.includes('/'));
      //
      //         tokenList = tokenList.filter(i => !i.symbol.includes('/'))
      //         //localStorage.setItem('tokenList', JSON.stringify(tokenList));
      //         //localStorage.setItem('liquidityList', JSON.stringify(liquidityList));
      //         dispatch(setTokenList(tokenList));
      //         dispatch(setLiquidityList(liquidityList));
      //     }
          setconnectAsyncIsWaiting(false);
          setExistsPair(true)

  }

  function getCurBtn(){
      // console.log("22",curPia)
          if(curExist && fromToken.symbol && toToken.symbol && !notDeployedWallets.length){
              console.log(1,curExist)

          return <button className={(fromToken.symbol && toToken.symbol && fromValue && toValue) ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"} onClick={() => handleConfirm()}>Swap</button>
      }else if((!curExist || notDeployedWallets.length) && fromToken.symbol && toToken.symbol){
              console.log("curExist",curExist,"notDeployedWallets.length",notDeployedWallets.length)

              return <button className={(fromToken.symbol && toToken.symbol) ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"} onClick={() => handleConnectPair()}>Connect pair</button>
      }
      console.log(3)

              return <button className={(fromToken.symbol && toToken.symbol && fromValue && toValue) ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"} onClick={() => handleConfirm()}>Swap</button>

  }

  return (
    <div className="container">
      { (!swapAsyncIsWaiting && !connectAsyncIsWaiting) && (
        <MainBlock
          smallTitle={false}
          title={'Swap'}
          content={
            <div>
              <Input
                type={'from'}
                text={'From'}
                token={fromToken}
                value={fromValue}
                incorrectBalance={incorrectBalance}
              />
              <SwapBtn
                fromToken={fromToken}
                toToken={toToken}
                page={'swap'}
              />
              <Input
                type={'to'}
                text={toValue > 0 ? <>To <span>(estimated)</span></> : 'To'}
                token={toToken}
                value={toValue}
                incorrectBalance={false}

              />
              { walletIsConnected ?
                  getCurBtn()
                  :
                <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button>
              }
              { (fromToken.symbol && toToken.symbol) && <p className="swap-rate">Price <span>{parseFloat(rate).toFixed(rate > 0.0001 ? 4 : 6)} {toToken.symbol}</span> per <span>1 {fromToken.symbol}</span></p> }

            </div>
          }
          />
        )}

        { swapConfirmPopupIsVisible && <SwapConfirmPopup hideConfirmPopup={setSwapConfirmPopupIsVisible.bind(this, false)} /> }
        { connectAsyncIsWaiting && <WaitingPopupConnect text={`Connecting to ${fromToken.symbol}/${toToken.symbol} pair, ${connectPairStatusText}`} /> }
        { swapAsyncIsWaiting && <WaitingPopup text={`Swapping ${fromValue} ${fromToken.symbol} for ${toValue} ${toToken.symbol}`} /> }

    </div>
  )
}

export default Swap;
