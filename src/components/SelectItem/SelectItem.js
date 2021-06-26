import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useLocation} from 'react-router-dom';
// import { getPairReserves } from '../../extensions/sdk/run3';
import { iconGenerator } from '../../iconGenerator';
import {hidePoolFromSelect, hidePoolToSelect, setPoolFromToken, setPoolPairId, setPoolToInputValue, setPoolToToken} from '../../store/actions/pool';
import {hideSwapFromSelect, hideSwapToSelect, setSwapFromToken, setSwapPairId, setSwapRate, setSwapToInputValue, setSwapToToken} from '../../store/actions/swap';
import './SelectItem.scss';

function getFullName(name){
  if(name === "TON"){
    return "TON Crystal"
  } else if(name === "WTON"){
    return "TON Crystal"
  } else if(name === "fBTC"){
    return "fBitcoin"
  }else if(name === "WETH"){
    return "Ethereum"
  }else if(name === "fETH"){
    return "fEthereum"
  }else if(name === "WBTC"){
    return "Bitcoin"
  }else if(name === "DS-WTON/USDT"){
    return "Pool tokens of TON/USDT pair"
  }else if(name === "DS-WTON/WETH"){
    return "Pool tokens of TON/ETH pair"
  }else if(name === "DS-WTON/WBTC"){
    return "Pool tokens of TON/BTC pair"
  }else if(name === "USDT"){
    return "Tether"
  }else{
    return name
  }
}


function SelectItem(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  const swapFromToken = useSelector(state => state.swapReducer.fromToken);
  const swapToToken = useSelector(state => state.swapReducer.toToken);
  const poolFromToken = useSelector(state => state.poolReducer.fromToken);
  const poolToToken = useSelector(state => state.poolReducer.toToken);
console.log("props",props)
  async function handleClick() {
    if(props.isActive) { return }
    if(props.type ==='from') {
      const payload = {
        walletAddress: '',
        symbol: props.symbol,
        balance: props.balance
      }
      if(location.pathname.includes('swap')) {
        dispatch(setSwapFromToken(payload));
        if(swapToToken.symbol) {
          const payload = {
            walletAddress: '',
            symbol: '',
            balance: 0
          }
          dispatch(setSwapToToken(payload));
          dispatch(setSwapToInputValue(0));
          dispatch(setSwapRate(0));
          dispatch(setSwapPairId(''));
        }
        dispatch(hideSwapFromSelect());
      } else {
        dispatch(setPoolFromToken(payload));
        if(poolToToken.symbol) {
          const payload = {
            walletAddress: '',
            symbol: '',
            balance: 0
          }
          dispatch(setPoolToToken(payload));
          dispatch(setPoolToInputValue(0));
          dispatch(setPoolPairId(''));
        }
        dispatch(hidePoolFromSelect());
      }
    }
    if(props.type === 'to') {
      const payload = {
        walletAddress: '',
        symbol: props.symbol,
        balance: props.balance
      }
      if(location.pathname.includes('swap')) {
        dispatch(setSwapToToken(payload));
        dispatch(setSwapPairId(props.pairId));
        dispatch(hideSwapToSelect());
      } else {
        dispatch(setPoolToToken(payload));
        dispatch(setPoolPairId(props.pairId));
        dispatch(hidePoolToSelect());
      }
    }
  }

  return (
    <div className={props.isActive ? "select-item select-item--active" : "select-item"} onClick={() => handleClick()}>
      <div className="select-item-wrapper">
        <img src={iconGenerator(props.symbol)} alt={props.symbol}/>
        <div>
          <p className="select-item-title">{props.symbol}</p>
          <p className="select-item-descr">{getFullName(props.symbol)}</p>
        </div>
      </div>
      { walletIsConnected && <span className="select-item-balance">{props.balance < 0.0001 ? parseFloat(props.balance.toFixed(8)) :  parseFloat(props.balance.toFixed(4))}</span> }
    </div>
  )
}

export default SelectItem;
