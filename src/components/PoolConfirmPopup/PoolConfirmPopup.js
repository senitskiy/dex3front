import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPoolAsyncIsWaiting } from '../../store/actions/pool';
import { processLiquidity } from '../../extensions/sdk/run';
import { showPopup } from '../../store/actions/app';
import { iconGenerator } from '../../iconGenerator';
import MainBlock from '../MainBlock/MainBlock';
import CloseBtn from '../CloseBtn/CloseBtn';
import {setSwapAsyncIsWaiting} from "../../store/actions/swap";
import {setManageAsyncIsWaiting} from "../../store/actions/manage";
import {setTransactionsList} from "../../store/actions/wallet";

function PoolConfirmPopup(props) {
  const dispatch = useDispatch();

  let curExt = useSelector(state => state.appReducer.curExt);

  const fromToken = useSelector(state => state.poolReducer.fromToken);
  const toToken = useSelector(state => state.poolReducer.toToken);

  const fromValue = useSelector(state => state.poolReducer.fromInputValue);
  const toValue = useSelector(state => state.poolReducer.toInputValue);


  const transactionsList = useSelector(state => state.walletReducer.transactionsList);

  const pairId = useSelector(state => state.poolReducer.pairId);

  async function handleSuply() {

    dispatch(setPoolAsyncIsWaiting(true));
    props.hideConfirmPopup();
    console.log("fromValue",fromValue,"toValue",toValue)
      let poolStatus = await processLiquidity(curExt, pairId, (fromValue * 1000000000).toFixed(), (toValue * 1000000000).toFixed());
    console.log("pairId",pairId)
      console.log("poolStatus",poolStatus)
    if(!poolStatus || (poolStatus && (poolStatus.code === 1000 || poolStatus.code === 3))){
      dispatch(setPoolAsyncIsWaiting(false))
    }

    let olderLength = transactionsList.length;
    let newLength = transactionsList.push({
      type: "processLiquidity",
      fromValue: fromValue,
      toValue: toValue,
      fromSymbol: fromToken.symbol,
      toSymbol: toToken.symbol,
      lpTokens: null,
      LPsymbol:`DS-W${fromToken.symbol}/W${toToken.symbol}`
    })
    let item = newLength - 1
    console.log("itemitem",typeof item,item,"prop",newLength - 1, "menu",newLength.length - olderLength.length)
    localStorage.setItem("currentElement", item);
    localStorage.setItem("lastType", "processLiquidity");
    if (transactionsList.length) await dispatch(setTransactionsList(transactionsList));


    // if(poolStatus && poolStatus.code){
    //   dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
    //   dispatch(setPoolAsyncIsWaiting(false))
    // }
    // if(!poolStatus.code){
    //   dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
    // }
    //  if(poolStatus.code){
    //    dispatch(setPoolAsyncIsWaiting(false))
       // switch (poolStatus.text) {
       //
       //   case 'Canceled by user.':
       //     dispatch(showPopup({type: 'error', message: 'Operation canceled.'}));
       //     break;
       //   case 'Rejected by user':
       //     dispatch(showPopup({type: 'error', message: 'Operation canceled.'}));
       //     break;
       //   default:
       //     dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
       //     break;
       //
       // }

     }

    // dispatch(setPoolAsyncIsWaiting(false))



  return (
    <div className="popup-wrapper confirm-popup">
      <MainBlock
        smallTitle={true}
        button={
          <svg onClick={() => props.hideConfirmPopup()} className="close" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.6" d="M21.7676 25.272L13 16.507L4.23239 25.272C4.00265 25.5027 3.7296 25.6858 3.42891 25.8108C3.12822 25.9357 2.80582 26 2.48021 26C2.15459 26 1.83219 25.9357 1.5315 25.8108C1.23081 25.6858 0.957759 25.5027 0.728021 25.272C0.497277 25.0422 0.314182 24.7692 0.189248 24.4685C0.0643133 24.1678 0 23.8454 0 23.5198C0 23.1942 0.0643133 22.8718 0.189248 22.5711C0.314182 22.2704 0.497277 21.9973 0.728021 21.7676L9.49296 13L0.728021 4.23239C0.497277 4.00265 0.314182 3.7296 0.189248 3.42891C0.0643133 3.12822 0 2.80582 0 2.48021C0 2.15459 0.0643133 1.83219 0.189248 1.5315C0.314182 1.23081 0.497277 0.957759 0.728021 0.728021C0.957759 0.497277 1.23081 0.314182 1.5315 0.189248C1.83219 0.0643133 2.15459 0 2.48021 0C2.80582 0 3.12822 0.0643133 3.42891 0.189248C3.7296 0.314182 4.00265 0.497277 4.23239 0.728021L13 9.49296L21.7676 0.728021C21.9973 0.497277 22.2704 0.314182 22.5711 0.189248C22.8718 0.0643133 23.1942 0 23.5198 0C23.8454 0 24.1678 0.0643133 24.4685 0.189248C24.7692 0.314182 25.0422 0.497277 25.272 0.728021C25.5027 0.957759 25.6858 1.23081 25.8108 1.5315C25.9357 1.83219 26 2.15459 26 2.48021C26 2.80582 25.9357 3.12822 25.8108 3.42891C25.6858 3.7296 25.5027 4.00265 25.272 4.23239L16.507 13L25.272 21.7676C25.5027 21.9973 25.6858 22.2704 25.8108 22.5711C25.9357 22.8718 26 23.1942 26 23.5198C26 23.8454 25.9357 24.1678 25.8108 24.4685C25.6858 24.7692 25.5027 25.0422 25.272 25.272C25.0422 25.5027 24.7692 25.6858 24.4685 25.8108C24.1678 25.9357 23.8454 26 23.5198 26C23.1942 26 22.8718 25.9357 22.5711 25.8108C22.2704 25.6858 21.9973 25.5027 21.7676 25.272Z" fill="white"/>
          </svg>
        }
        content={
          <>
            <p className="confirm-subtitle">You will receive</p>
            <div className="confirm-block">
              <span className="confirm-value">~{props.lpAmount}</span>
              <img className="confirm-icon" src={iconGenerator(fromToken.symbol)} alt={fromToken.symbol}/>
              <img className="confirm-icon" src={iconGenerator(toToken.symbol)} alt={toToken.symbol}/>
              <span className="confirm-tokenF">DS-{fromToken.symbol}/{toToken.symbol} LP Tokens</span>
            </div>
            <p className="confirm-text">Output is estimated. If the price changes by more than 0.5% your transaction will revert</p>
            <button className="btn popup-btn" onClick={() => handleSuply()}>Confirm Supply</button>
          </>
        }
        // footer={
        //   <div className="mainblock-footer">
        //     <div className="mainblock-footer-wrap">
        //       <div>
        //         <div  className="pool-confirm-wrap">
        //           <p className="mainblock-footer-value">0.0001</p>
        //           <p className="mainblock-footer-subtitle">{fromToken.symbol} deposited</p>
        //         </div>
        //         <div>
        //           <p className="mainblock-footer-value">{parseFloat(props.rateBA.toFixed(4))}</p>
        //           <p className="mainblock-footer-subtitle">{fromToken.symbol} per {toToken.symbol}</p>
        //         </div>
        //       </div>
        //       <div>
        //         <div  className="pool-confirm-wrap">
        //           <p className="mainblock-footer-value">10000003</p>
        //           <p className="mainblock-footer-subtitle">{toToken.symbol} deposited</p>
        //         </div>
        //         <div>
        //           <p className="mainblock-footer-value">{parseFloat(props.rateAB.toFixed(4))}</p>
        //           <p className="mainblock-footer-subtitle">{toToken.symbol} per {fromToken.symbol}</p>
        //         </div>
        //       </div>
        //       <div>
        //         <div  className="pool-confirm-wrap">
        //           <p className="mainblock-footer-value">999785</p>
        //           <p className="mainblock-footer-subtitle">Rates</p>
        //         </div>
        //         <div>
        //           <p className="mainblock-footer-value">&lt;0.01%</p>
        //           <p className="mainblock-footer-subtitle">Share of Pool</p>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // }
      />
    </div>
  )
}

export default PoolConfirmPopup;
