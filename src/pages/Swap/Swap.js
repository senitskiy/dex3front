import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {showPopup} from '../../store/actions/app';
import MainBlock from './../../components/MainBlock/MainBlock';
import Input from './../../components/Input/Input';
import SwapBtn from '../../components/SwapBtn/SwapBtn';
import SwapConfirmPopup from '../../components/SwapConfirmPopup/SwapConfirmPopup';
import WaitingPopup from '../../components/WaitingPopup/WaitingPopup';
import './Swap.scss';

function Swap () {
  const history = useHistory();
  const dispatch = useDispatch();

  const connectingWallet = useSelector(state => state.appReducer.connectingWallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const accountIsVisible = useSelector(state => state.appReducer.accountIsVisible);

  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const pairsList = useSelector(state => state.walletReducer.pairsList);

  const fromToken = useSelector(state => state.swapReducer.fromToken);
  const toToken = useSelector(state => state.swapReducer.toToken);

  const fromValue = useSelector(state => state.swapReducer.fromInputValue);
  const toValue = useSelector(state => state.swapReducer.toInputValue);
  const pairId = useSelector(state => state.swapReducer.pairId);
  const swapAsyncIsWaiting = useSelector(state => state.swapReducer.swapAsyncIsWaiting);
  const [swapConfirmPopupIsVisible, setSwapConfirmPopupIsVisible] = useState(false);

  const rate = useSelector(state => state.swapReducer.rate);

  function handleConfirm() {
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

  // function getAmountOut(amountIn) {
  //   if(!amountIn){
  //     return 0
  //   }
  //   let reserves = pairsList.filter(item=>item.pairAddress === pairId)
  //   console.log("reserves",reserves)
  //   let rootIn = reserves[0].reserveA
  //   let rootOut = reserves[0].reservetB
  //   console.log("rootIn",rootIn,"amountIn",amountIn,"rootOut",rootOut)
  //   let amountInWithFee = amountIn * 997;
  //   let numerator = amountInWithFee * rootOut;
  //   let denominator = amountInWithFee + rootIn * 1000;
  //   return (numerator/denominator).toFixed(4);
  //   // return 1;
  // }


  return (
    <div className="container">
      { !swapAsyncIsWaiting && (
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
              />
              { walletIsConnected ?
                <button className={(fromToken.symbol && toToken.symbol && fromValue && toValue) ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"} onClick={() => handleConfirm()}>Swap</button> :
                <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button>
              }
              { (fromToken.symbol && toToken.symbol) && <p className="swap-rate">Price <span>{parseFloat(rate.toFixed(4))} {toToken.symbol}</span> per <span>{fromToken.symbol}</span></p> }

            </div>
          }
          />
        )}

        { swapConfirmPopupIsVisible && <SwapConfirmPopup hideConfirmPopup={setSwapConfirmPopupIsVisible.bind(this, false)} /> }

        { swapAsyncIsWaiting && <WaitingPopup text={`Swapping ${fromValue} ${fromToken.symbol} for ${toValue} ${toToken.symbol}`} /> }
    </div>
  )
}

export default Swap;