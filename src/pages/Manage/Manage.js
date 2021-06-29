import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPairsTotalSupply } from '../../extensions/webhook/script';
import { setManageAsyncIsWaiting } from '../../store/actions/manage';
import { returnLiquidity } from '../../extensions/sdk/run';
import { showPopup } from '../../store/actions/app';
import { iconGenerator } from '../../iconGenerator';
import Slider from 'react-rangeslider'
import MainBlock from '../../components/MainBlock/MainBlock';
import ManageConfirmPopup from '../../components/ManageConfirmPopup/ManageConfirmPopup';
import WaitingPopup from '../../components/WaitingPopup/WaitingPopup';
import './Manage.scss';
import {setPoolAsyncIsWaiting} from "../../store/actions/pool";

function Manage() {
  const dispatch = useDispatch();

  let curExt = useSelector(state => state.appReducer.curExt);
  const fromToken = useSelector(state => state.manageReducer.fromToken);
  const toToken = useSelector(state => state.manageReducer.toToken);
  const rateAB = useSelector(state => state.manageReducer.rateAB);
  const rateBA = useSelector(state => state.manageReducer.rateBA);
  const balance = useSelector(state => state.manageReducer.balance);
  const pairId = useSelector(state => state.manageReducer.pairId);
  const manageAsyncIsWaiting = useSelector(state => state.manageReducer.manageAsyncIsWaiting);
console.log("pair", pairId)
  const [managePopupIsVisible, setManagePopupIsVisible] = useState(true);
  const [manageRemoveIsVisible, setManageRemoveIsVisible] = useState(false);

  const [rangeValue, setRangeValue] = useState(0);
  const [percent, setPercent] = useState(0);

  const [qtyA, setQtyA] = useState(0);
  const [qtyB, setQtyB] = useState(0);

  useEffect(async () => {
    const total = await getPairsTotalSupply(pairId)
    setPercent((balance * 100) / total)
  }, [])

  function toggleClick() {
    setManagePopupIsVisible(!managePopupIsVisible);
    setManageRemoveIsVisible(!manageRemoveIsVisible);
  }

  const handleChange = value => {
    setRangeValue(value)
    setQtyA((((fromToken.reserve * percent) / 100) * value) / 100)
    setQtyB((((toToken.reserve * percent) / 100) * value) / 100)
  }

  const handleRemove = async () => {
    dispatch(setManageAsyncIsWaiting(true));


      console.log("NUMMMM",Number(((balance.toFixed() * rangeValue) / 100) * 1000000000))
      let returnStatus = await returnLiquidity(curExt, pairId, ((balance * rangeValue) / 100) * 1000000000);

      console.log("returnStatus",returnStatus)
    if(!returnStatus || (returnStatus && (returnStatus.code === 1000 || returnStatus.code === 3))){
      dispatch(setManageAsyncIsWaiting(false))
    }
      // dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
      // dispatch(setPoolAsyncIsWaiting(false))

    // if(returnStatus && returnStatus.code) {
      // dispatch(setPoolAsyncIsWaiting(false))
      // switch (returnStatus.text) {
      //   case 'Canceled by user.':
      //     dispatch(showPopup({type: 'error', message: 'Operation canceled.'}));
      //     break;
      //   case 'Rejected by user':
      //     dispatch(showPopup({type: 'error', message: 'Operation canceled.'}));
      //     break;
      //   default:
      //     dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
      //     break;
      // }
    // }
    // if(returnStatus && !returnStatus.code) {
    //   dispatch(setManageAsyncIsWaiting(false));
    // }
  }

  return(
    <div className="container">
      { !manageAsyncIsWaiting && <>

        { managePopupIsVisible && <ManageConfirmPopup func={toggleClick.bind(this)} /> }

        { manageRemoveIsVisible && (
          <MainBlock
            smallTitle={false}
            title={
              <Link to={'/pool'} className="pool-back">
                <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.9142 4.4108C11.6953 3.62975 11.6953 2.36342 10.9142 1.58237C10.1332 0.80132 8.86684 0.80132 8.08579 1.58237L10.9142 4.4108ZM2.5 9.99658L1.08579 8.58237C0.304738 9.36342 0.304738 10.6297 1.08579 11.4108L2.5 9.99658ZM8.08579 18.4108C8.86683 19.1918 10.1332 19.1918 10.9142 18.4108C11.6953 17.6297 11.6953 16.3634 10.9142 15.5824L8.08579 18.4108ZM8.08579 1.58237L1.08579 8.58237L3.91421 11.4108L10.9142 4.4108L8.08579 1.58237ZM1.08579 11.4108L8.08579 18.4108L10.9142 15.5824L3.91421 8.58237L1.08579 11.4108Z" fill="white"/>
                </svg>
                Remove Liquidity
              </Link>
            }
            content={
              <div className="manage">
                <div className="manage-percents">
                  <span className="manage-percent-value">{rangeValue}%</span>
                  <div className="manage-percents-btns">
                    <div className="manage-percent-btn" onClick={() => handleChange(25)}>25%</div>
                    <div className="manage-percent-btn" onClick={() => handleChange(50)}>50%</div>
                    <div className="manage-percent-btn" onClick={() => handleChange(75)}>75%</div>
                    <div className="manage-percent-btn" onClick={() => handleChange(100)}>100%</div>
                  </div>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={rangeValue}
                  onChange={value => handleChange(value)}
                  tooltip={false}
                />
                <p className="manage-subtitle">Amount</p>
                <div className="manage-token-wrapper">
                  <div className="manage-token-balance">{qtyA < 0.0001 ? parseFloat(qtyA.toFixed(8)) : parseFloat(qtyA.toFixed(4))}</div>
                  <div className="manage-token-symbol">
                    <img src={iconGenerator(fromToken.symbol)} alt={fromToken.symbol} />
                    {fromToken.symbol}
                  </div>
                </div>
                <div className="manage-token-wrapper">
                  <div className="manage-token-balance">{qtyB < 0.0001 ? parseFloat(qtyB.toFixed(8)) : parseFloat(qtyB.toFixed(4))}</div>
                  <div className="manage-token-symbol">
                    <img src={iconGenerator(toToken.symbol)} alt={toToken.symbol} />
                    {toToken.symbol}
                  </div>
                </div>
                <p className="manage-subtitle">Price</p>
                <p className="manage-text">1 {fromToken.symbol} = {rateAB < 0.0001 ? parseFloat(rateAB.toFixed(8)) : parseFloat(rateAB.toFixed(4))} {toToken.symbol}</p>
                <p className="manage-text">1 {toToken.symbol} = {rateBA < 0.0001 ? parseFloat(rateBA.toFixed(8)) : parseFloat(rateBA.toFixed(4))} {fromToken.symbol}</p>
                <button onClick={handleRemove} className={rangeValue !== 0 ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"}>Remove</button>
              </div>
            }
          />
        )}
      </>}

      { manageAsyncIsWaiting && <WaitingPopup text={`Removing ${qtyA < 0.0001 ? parseFloat(qtyA.toFixed(8)) : parseFloat(qtyA.toFixed(4))} ${fromToken.symbol} and ${qtyB < 0.0001 ? parseFloat(qtyB.toFixed(8)) : parseFloat(qtyB.toFixed(4))} ${toToken.symbol}`} /> }
    </div>
  )
}

export default Manage;
