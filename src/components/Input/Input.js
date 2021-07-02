import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { hidePopup, showPopup } from '../../store/actions/app';
import { setSwapFromInputValue, setSwapRate, setSwapToInputValue, showSwapFromSelect, showSwapToSelect } from '../../store/actions/swap';
import { setPoolFromInputValue, setPoolRate, setPoolToInputValue, showPoolFromSelect, showPoolToSelect } from '../../store/actions/pool';
import { _ } from '../../freeton';
import Select from '../Select/Select'
import './Input.scss';
import { iconGenerator } from '../../iconGenerator';
// import { getPairReserves } from '../../extensions/sdk/run3';

function Input(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  const swapFromSelectIsVisible = useSelector(state => state.swapReducer.swapFromSelectIsVisible);
  const swapToSelectIsVisible = useSelector(state => state.swapReducer.swapToSelectIsVisible);
  const revertValue = useSelector(state => state.swapReducer.revertValue);

  const poolFromSelectIsVisible = useSelector(state => state.poolReducer.poolFromSelectIsVisible);
  const poolToSelectIsVisible = useSelector(state => state.poolReducer.poolToSelectIsVisible);

  const swapFromToken = useSelector(state => state.swapReducer.fromToken);
  const swapToToken = useSelector(state => state.swapReducer.toToken);

  const swapFromValue = useSelector(state => state.swapReducer.fromInputValue);
  const swapToValue = useSelector(state => state.swapReducer.toInputValue);

  const poolFromToken = useSelector(state => state.poolReducer.fromToken);
  const poolToToken = useSelector(state => state.poolReducer.toToken);

  const poolFromValue = useSelector(state => state.poolReducer.fromInputValue);
  const poolToValue = useSelector(state => state.poolReducer.toInputValue);

  const pairsList = useSelector(state => state.walletReducer.pairsList);

  const swapRate = useSelector(state => state.swapReducer.rate);
  const poolRate = useSelector(state => state.poolReducer.rate);
  //console.log(pairsList, swapRate, poolRate, poolFromToken, poolToToken, poolFromValue, swapFromValue, swapFromToken, poolToValue, swapToValue);
  const [value, setValue] = useState(props.value);

  useEffect(async () => {
    if(location.pathname.includes('swap') && swapFromToken.symbol && swapToToken.symbol) {
      pairsList.forEach(i => {
        if(i.symbolA === swapFromToken.symbol && i.symbolB === swapToToken.symbol) {
          dispatch(setSwapRate(i.rateAB));
        } else if(i.symbolB === swapFromToken.symbol && i.symbolA === swapToToken.symbol) {
          dispatch(setSwapRate(i.rateBA));
        }
      })
    }
    if(location.pathname.includes('add-liquidity') && poolFromToken.symbol && poolToToken.symbol) {
      pairsList.forEach(i => {
        if(i.symbolA === poolFromToken.symbol && i.symbolB === poolToToken.symbol) {
          dispatch(setPoolRate(i.rateAB));
        } else if(i.symbolB === poolFromToken.symbol && i.symbolA === poolToToken.symbol) {
          dispatch(setPoolRate(i.rateBA));
        }
      })
    }
  }, [swapFromToken, swapToToken, poolFromToken, poolToToken, pairsList])

  useEffect(() => {
    // if(revertValue){
    //   console.log("revert", revertValue)
    //   changeValue(revertValue);
    // }else{
      console.log("revert +++++++",props.token.balance)
      changeValue(props.token.balance);
    // }

  }, [value, swapRate, poolRate])

  // useEffect(() => {
  //   changeValue(revertValue);
  // }, [revertValue])



  async function handleClick() {
    try {
      if(location.pathname.includes('swap')) {
        if(props.type === 'to' && !swapFromToken.symbol) {
          dispatch(showPopup({type: 'error', message: 'Please, choose from token first.'}));
        } else {
          dispatch(props.type === 'from' ? showSwapFromSelect() : showSwapToSelect());
        }
      } else if(location.pathname.includes('add-liquidity')) {
        if(props.type === 'to' && !poolFromToken.symbol) {
          dispatch(showPopup({type: 'error', message: 'Please, choose from token first.'}));
        } else {
          dispatch(props.type === 'from' ? showPoolFromSelect() : showPoolToSelect());
        }
      }
    } catch(e) {
      dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}))
    }
  }

  function changeValue(curValue) {
    if(location.pathname.includes('swap')) {
      if(props.type === 'from') {
        console.log("hange vvalue",props.token.balance)
        // if(curValue && value > curValue) {
          let val = Number(value) * swapRate;
          val < 0.0001 ? val = parseFloat(val.toFixed(8)) : val = parseFloat(val.toFixed(4))


          let val2 = Number(value)
          val2 < 0.0001 ? val2 = parseFloat(Number(value).toFixed(8)) : val2 = parseFloat(Number(value).toFixed(4))
          dispatch(setSwapFromInputValue(val2));
          dispatch(setSwapToInputValue(val));
          console.log("val2",val2)
        // }
        // else  {
        //   dispatch(setSwapFromInputValue(value));
        //   let val = value * swapRate;
        //   let val1 = 0;
        //   if(val < 0.0001) val1 = parseFloat(val.toFixed(8))
        //   else val1 = parseFloat(val.toFixed(4))
        //   dispatch(setSwapToInputValue(val1));
        // }

      // } else if(props.type === 'to') {
        // dispatch(setSwapToInputValue(value));
        // dispatch(setSwapFromInputValue(parseFloat((value / swapRate).toFixed(4))));
      }
    } else if(location.pathname.includes('add-liquidity')) {
      if(props.type === 'from') {
        dispatch(setPoolFromInputValue(value));
        let val = value * poolRate;
        let val1 = 0;
        if(val < 0.0001) val1 = parseFloat(val.toFixed(8))
        else val1 = parseFloat(val.toFixed(4))
        dispatch(setPoolToInputValue(val1));
      }
    }
  }
  function handleKeyPress(event) {
    console.log(event, "evern")
    if(event.key === '-' || event.key === '+') { event.preventDefault() }
  }
  const [changer,setChanger] = useState(0)
  useEffect(()=>{
    console.log(changer, "changer")
    if(location.pathname.includes('swap') && swapFromToken.symbol && swapToToken.symbol) {
      // if()
      setValue(changer)
    }
    if(location.pathname.includes('add-liquidity') && poolFromToken.symbol && poolToToken.symbol) {
      setValue(changer)
    }


  },[changer])
  useEffect(()=>{

    setValue(revertValue)
  },[revertValue])

  const [incorrectValue, setIncorrect] = useState(false)
  useEffect(()=>{
    if(props.type === "to"){
      console.log("props.incorrectBalanceToValue",props.incorrectBalanceToValue)
      setIncorrect(props.incorrectBalanceToValue)

    }else{
      console.log("props.incorrectBalance",props.incorrectBalance)
      setIncorrect(props.incorrectBalance)
    }
  },[props.incorrectBalanceToValue,props.incorrectBalance])

  return (
    <>
      <div className="input">
        <div className="input-wrapper">
          <span className="input-title">{props.text}</span>
          <span className={incorrectValue ? "input-balance incorBalance " : "input-balance"}>{(walletIsConnected && props.token.symbol) && `Balance: ${
            props.token.balance < 0.0001 ? parseFloat(props.token.balance.toFixed(8)) : parseFloat(props.token.balance.toFixed(4))
          }
            `}</span>
        </div>
        <div className="input-wrapper">
          <input
            type="number"
            className={props.value > 0 ? "input-field" : "input-field input-field--zero"}
            value={props.value}
            onChange={event => setChanger(+event.target.value)}
            onKeyPress={event => handleKeyPress(event)}
            min="0"
            autoFocus={props.autoFocus || false}
            placeholder="0"
            readOnly={props.readOnly}
          />

          { !props.token.symbol ? (
            <button className="btn input-btn" onClick={() => handleClick()}>
              Select a token
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L3.06066 0.93934ZM8 8L6.93934 9.06066C7.52513 9.64645 8.47487 9.64645 9.06066 9.06066L8 8ZM15.0607 3.06066C15.6464 2.47487 15.6464 1.52513 15.0607 0.93934C14.4749 0.353553 13.5251 0.353553 12.9393 0.93934L15.0607 3.06066ZM0.93934 3.06066L6.93934 9.06066L9.06066 6.93934L3.06066 0.93934L0.93934 3.06066ZM9.06066 9.06066L15.0607 3.06066L12.9393 0.93934L6.93934 6.93934L9.06066 9.06066Z" fill="white"/>
              </svg>
            </button>
          ) : (
            <>
              { (walletIsConnected && props.type === 'from') && <button className="input-max" onClick={() => setValue(parseFloat(props.token.balance).toFixed(4))}>MAX</button> }
              <button className="input-select" onClick={() => handleClick()}>
                <img src={iconGenerator(props.token.symbol)} alt={props.token.symbol} className="input-token-img"/>
                <span>{props.token && props.token.symbol}</span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L3.06066 0.93934ZM8 8L6.93934 9.06066C7.52513 9.64645 8.47487 9.64645 9.06066 9.06066L8 8ZM15.0607 3.06066C15.6464 2.47487 15.6464 1.52513 15.0607 0.93934C14.4749 0.353553 13.5251 0.353553 12.9393 0.93934L15.0607 3.06066ZM0.93934 3.06066L6.93934 9.06066L9.06066 6.93934L3.06066 0.93934L0.93934 3.06066ZM9.06066 9.06066L15.0607 3.06066L12.9393 0.93934L6.93934 6.93934L9.06066 9.06066Z" fill="white"/>
                </svg>
              </button>
            </>
            )}
        </div>
      </div>

      { (swapFromSelectIsVisible && props.type === 'from') && <Select type={props.type} /> }
      { (swapToSelectIsVisible && props.type === 'to') && <Select type={props.type} /> }

      { (poolFromSelectIsVisible && props.type === 'from') && <Select type={props.type} /> }
      { (poolToSelectIsVisible && props.type === 'to') && <Select type={props.type} /> }
    </>
  )
}

export default Input;
