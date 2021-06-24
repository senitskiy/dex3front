import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import MainBlock from '../../components/MainBlock/MainBlock';
import Input from '../../components/Input/Input';
import PoolConfirmPopup from '../../components/PoolConfirmPopup/PoolConfirmPopup';
import WaitingPopup from '../../components/WaitingPopup/WaitingPopup';
import './AddLiquidity.scss';
import { showPopup } from '../../store/actions/app';

function AddLiquidity () {
  const history = useHistory();
  const dispatch = useDispatch();

  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  const pairsList = useSelector(state => state.walletReducer.pairsList);


  const fromToken = useSelector(state => state.poolReducer.fromToken);
  const toToken = useSelector(state => state.poolReducer.toToken);

  const fromValue = useSelector(state => state.poolReducer.fromInputValue);
  const toValue = useSelector(state => state.poolReducer.toInputValue);
  const pairId = useSelector(state => state.poolReducer.pairId);

  const poolAsyncIsWaiting = useSelector(state => state.poolReducer.poolAsyncIsWaiting);
  const [poolConfirmPopupIsVisible, setPoolConfirmPopupIsVisible] = useState(false);

  const [rateAB, setRateAB] = useState(0);
  const [rateBA, setRateBA] = useState(0);

  const [fromTokenSymbol, setFromTokenSymbol] = useState('');
  const [toTokenSymbol, setTotTokenSymbol] = useState('');
  const [ratesData, setRatesData] = useState({});

  function qtyOneForOther(amountIn, reserveIn, reserveOut) {
    return Math.floor((amountIn *  reserveOut) / reserveIn);
  }


  function acceptForProvide(amountA, amountB, reserveA, reserveB) {


    let argA = qtyOneForOther(amountB, reserveB, reserveA);
    let argB = qtyOneForOther(amountA, reserveA, reserveB);
    let minAmountA = Math.min(amountA, argA);
    let minAmountB = Math.min(amountB, argB);
    let crmin = Math.min(reserveA, reserveB);
    let crmax = Math.max(reserveA, reserveB);
    let crquotient = ~~(crmax/crmin);
    let crremainder = crmax%crmin;
    let amountMin = Math.min(minAmountA,minAmountB);
    let amountOther = amountMin * crquotient + (amountMin * crremainder) / crmin ;
    let acceptForProvideA = minAmountA < minAmountB ? amountMin : amountOther;
    let acceptForProvideB = minAmountB < minAmountA ? amountMin : amountOther;

    return [Math.floor(acceptForProvideA), Math.floor(acceptForProvideB)];
  }

  function qtyForProvide(amountA, amountB, reserveA, reserveB) {
    let argA = qtyOneForOther(amountB, reserveB, reserveA);
    let argB = qtyOneForOther(amountA, reserveA, reserveB);
    let min = 1;
    let minAmountA = Math.min(amountA, argA);
    let minAmountB = Math.min(amountB, argB);
    let crmin = Math.min(reserveA, reserveB);
    let crmax = Math.max(reserveA, reserveB);
    let crquotient = ~~(crmax/crmin);
    let crremainder = crmax%crmin;
    let amountMin = Math.min(minAmountA,minAmountB)+1;
    let amountOther = amountMin * crquotient + (amountMin * crremainder) / crmin ;
    let acceptForProvideA = minAmountA < minAmountB ? amountMin : amountOther;
    let acceptForProvideB = minAmountB < minAmountA ? amountMin : amountOther;
    return [Math.floor(acceptForProvideA), Math.floor(acceptForProvideB)];
  }


  function getTotalLP (qtyA, qtyB, reserveA, reserveB,totalSupplyBefore) {
//console.log("qtyA, qtyB, reserveA, reserveB,totalSupplyBefore",qtyA, qtyB, reserveA, reserveB,totalSupplyBefore)
    let qtyArr = qtyForProvide(qtyA, qtyB, reserveA, reserveB);
    let provideArr = acceptForProvide(qtyArr[0], qtyArr[1], reserveA, reserveB);
   let  expectLiquidityTokens = Math.min(Math.floor((provideArr[0] * totalSupplyBefore) / reserveA), Math.floor((provideArr[1] * totalSupplyBefore) / reserveB));
   //console.log("expectLiquidityTokens",expectLiquidityTokens)
  return expectLiquidityTokens
  }


  useEffect(() => {

    if(!pairId){

    }else{
      let curPair = pairsList.filter(item=>item.pairAddress === pairId)

      let totalSupply = curPair[0].totalSupply
      let reservesA = curPair[0].reserveA
      let reservesB = curPair[0].reservetB
      let symbA = curPair[0].symbolA
      let symbB = curPair[0].symbolB
      //console.log("curPair",curPair)
      setRatesData({totalSupply:+totalSupply/1000000000,reservesA:+reservesA/1000000000,reservesB:+reservesB/1000000000,symbA:symbA,symbB:symbB})
    }

  }, [pairId]);



  useEffect(() => {



    if(fromToken && toToken) {
      pairsList.forEach(i => {
        if(i.symbolA === fromToken.symbol && i.symbolB === toToken.symbol) {
          setRateAB(i.rateAB);
          setRateBA(i.rateBA);
        } else if(i.symbolB === fromToken.symbol && i.symbolA === toToken.symbol) {
          setRateAB(i.rateAB);
          setRateBA(i.rateBA);
        }
      })

      if((fromTokenSymbol === fromToken.symbol || fromTokenSymbol === toToken.symbol) && (toTokenSymbol === fromToken.symbol || toTokenSymbol === toToken.symbol)) {
        return;
      } else {
        setFromTokenSymbol(fromToken.symbol);
        setTotTokenSymbol(toToken.symbol);
      }
    }
  }, [fromToken, toToken]);

  const [incorrectBalance,setincorrectBalance] = useState(false)
  const [incorrectBalanceToValue,setincorrectBalanceToValue] = useState(false)


  function handleConfirm() {
    if(fromValue > fromToken.balance){
      console.log("return",fromValue, "____", fromToken.balance)
      setincorrectBalance(true)
      setTimeout(() => setincorrectBalance(false), 200);
      return
    }
    if(toValue > toToken.balance){
      console.log("return",fromValue, "____", fromToken.balance)
      setincorrectBalanceToValue(true)
      setTimeout(() => setincorrectBalanceToValue(false), 200);
      return
    }


    if(fromToken.symbol && toToken.symbol && fromValue) {
      // if(fromValue > fromToken.balance ) {
      //   dispatch(showPopup({type: 'error', message: 'Excess of balance'}));
      //   return;
      // }
      setPoolConfirmPopupIsVisible(true);
    } else {
      dispatch(showPopup({type: 'error', message: 'Fields should not be empty'}));
    }
  }

  // function checkValueFrom(){
  //
  // }


  function mixPercentValue(totalLP, totalSup){
    let percOfTotal = (totalLP*100)/totalSup
    //
    // let percOfTotal = ((fromValue*100)/(totalSup+fromValue)).toFixed(6)
    // //console.log("totalSup",totalSup)
    return +percOfTotal
  }

  let totalLP = getTotalLP(fromValue*1000000000,toValue*1000000000,ratesData.reservesA*1000000000,ratesData.reservesB*1000000000, ratesData.totalSupply*1000000000)/1000000000
  return (
    <div className="container">
      { !poolAsyncIsWaiting && (
        <MainBlock
          smallTitle={false}
          title={
            <Link to="/pool" className="pool-back" >
              <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.9142 4.4108C11.6953 3.62975 11.6953 2.36342 10.9142 1.58237C10.1332 0.80132 8.86684 0.80132 8.08579 1.58237L10.9142 4.4108ZM2.5 9.99658L1.08579 8.58237C0.304738 9.36342 0.304738 10.6297 1.08579 11.4108L2.5 9.99658ZM8.08579 18.4108C8.86683 19.1918 10.1332 19.1918 10.9142 18.4108C11.6953 17.6297 11.6953 16.3634 10.9142 15.5824L8.08579 18.4108ZM8.08579 1.58237L1.08579 8.58237L3.91421 11.4108L10.9142 4.4108L8.08579 1.58237ZM1.08579 11.4108L8.08579 18.4108L10.9142 15.5824L3.91421 8.58237L1.08579 11.4108Z" fill="white"/>
              </svg>
              Add liquidity
            </Link>
          }
          content={
            <div>
              <Input
                type={'from'}
                text={'From'}
                autoFocus={true}
                token={fromToken}
                value={fromValue}
                componentName={"provide"}
                incorrectBalance={incorrectBalance}

              />
              <svg className="add-liquidity-plus" width="45" height="46" viewBox="0 0 45 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3324 42.0171L19.33 26.1694L3.48234 26.167C3.06611 26.1679 2.6538 26.0866 2.26908 25.9277C1.88435 25.7689 1.5348 25.5356 1.24048 25.2413C0.946162 24.947 0.712873 24.5974 0.554009 24.2127C0.395143 23.828 0.31383 23.4157 0.314741 22.9994C0.313831 22.5832 0.395143 22.1709 0.554008 21.7862C0.712873 21.4014 0.94616 21.0519 1.24048 20.7576C1.5348 20.4632 1.88435 20.23 2.26907 20.0711C2.6538 19.9122 3.06611 19.8309 3.48234 19.8318L19.33 19.8294L19.3324 3.98176C19.3315 3.56553 19.4128 3.15322 19.5717 2.7685C19.7305 2.38378 19.9638 2.03422 20.2581 1.7399C20.5525 1.44558 20.902 1.21229 21.2867 1.05343C21.6715 0.894565 22.0838 0.813252 22.5 0.814161C22.9162 0.813252 23.3285 0.894565 23.7133 1.05343C24.098 1.21229 24.4475 1.44558 24.7419 1.7399C25.0362 2.03422 25.2695 2.38378 25.4283 2.7685C25.5872 3.15322 25.6685 3.56553 25.6676 3.98176L25.67 19.8294L41.5177 19.8318C41.9339 19.8309 42.3462 19.9122 42.7309 20.0711C43.1156 20.23 43.4652 20.4632 43.7595 20.7576C44.0538 21.0519 44.2871 21.4014 44.446 21.7862C44.6049 22.1709 44.6862 22.5832 44.6853 22.9994C44.6862 23.4157 44.6049 23.828 44.446 24.2127C44.2871 24.5974 44.0538 24.947 43.7595 25.2413C43.4652 25.5356 43.1156 25.7689 42.7309 25.9277C42.3462 26.0866 41.9339 26.1679 41.5177 26.167L25.67 26.1694L25.6676 42.0171C25.6685 42.4333 25.5872 42.8456 25.4283 43.2303C25.2695 43.6151 25.0362 43.9646 24.7419 44.2589C24.4475 44.5533 24.098 44.7865 23.7133 44.9454C23.3285 45.1043 22.9162 45.1856 22.5 45.1847C22.0838 45.1856 21.6715 45.1043 21.2867 44.9454C20.902 44.7865 20.5525 44.5533 20.2581 44.2589C19.9638 43.9646 19.7305 43.6151 19.5717 43.2303C19.4128 42.8456 19.3315 42.4333 19.3324 42.0171Z" fill="#41444E"/>
              </svg>
              <Input
                type={'to'}
                text={toValue > 0 ? <>To <span>(estimated)</span></> : 'To'}
                token={toToken}
                value={toValue}
                readOnly
                incorrectBalanceToValue={incorrectBalanceToValue}
              />
              { (fromToken.symbol && toToken.symbol) && (
                  <div style={{"display":"flex", "flexDirection":"row","justifyContent":"space-evenly","marginLeft": "-50px", "marginRight": "-50px"}}>
                    <div className="add-liquidity-wrapper">

                      <div>
                        <span>{

                          (getTotalLP(fromValue*1000000000,toValue*1000000000,ratesData.reservesA*1000000000,ratesData.reservesB*1000000000, ratesData.totalSupply*1000000000)/1000000000) !== 0
                              ?
                          (getTotalLP(fromValue*1000000000,toValue*1000000000,ratesData.reservesA*1000000000,ratesData.reservesB*1000000000, ratesData.totalSupply*1000000000)/1000000000) < 0.0001 ? (getTotalLP(fromValue*1000000000,toValue*1000000000,ratesData.reservesA*1000000000,ratesData.reservesB*1000000000, ratesData.totalSupply*1000000000)/1000000000).toFixed(6) : (getTotalLP(fromValue*1000000000,toValue*1000000000,ratesData.reservesA*1000000000,ratesData.reservesB*1000000000, ratesData.totalSupply*1000000000)/1000000000).toFixed(4)
                          :
                          (getTotalLP(fromValue*1000000000,toValue*1000000000,ratesData.reservesA*1000000000,ratesData.reservesB*1000000000, ratesData.totalSupply*1000000000)/1000000000).toFixed(4)

                        }</span>


                        You will receive LP tokens
                      </div>


                      <div>
                        <span>{rateBA < 0.0001 ? parseFloat(rateBA.toFixed(8)) : parseFloat(rateBA.toFixed(4)) }</span>
                        {fromTokenSymbol} per 1 {toTokenSymbol}
                      </div>

                      <div>
                        <span>{rateAB < 0.0001 ? parseFloat(rateAB.toFixed(8)) : parseFloat(rateAB.toFixed(4)) }</span>
                        {toTokenSymbol} per 1 {fromTokenSymbol}
                      </div>


                    </div>

                <div className="add-liquidity-wrapper">
                  <div>
                    <span>{`${
                        mixPercentValue(fromValue, ratesData.totalSupply) !== 0 ?
                      mixPercentValue(fromValue, ratesData.totalSupply) < 0.0001 ? (mixPercentValue(totalLP, ratesData.totalSupply)).toFixed(8) : (mixPercentValue(totalLP, ratesData.totalSupply)).toFixed(4) 
                            :
                            (mixPercentValue(totalLP, ratesData.totalSupply)).toFixed(4)

                    } %`}</span>
                    Your share of pool
                  </div>
                  <div>
                    <span>{parseFloat(ratesData.reservesA).toFixed(4)}</span>
                    {fromTokenSymbol} pooled
                  </div>

                  <div>
                    <span>{parseFloat(ratesData.reservesB).toFixed(4)}</span>
                    {toTokenSymbol} pooled
                  </div>
                </div>



                  </div>
              )}
              { walletIsConnected ?
                <button onClick={() => handleConfirm()} className={(fromToken.symbol && toToken.symbol && fromValue && toValue) ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"}>Supply</button> :
                <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button>
              }
            </div>
          }
      />)}

      { poolConfirmPopupIsVisible &&
        <PoolConfirmPopup
          hideConfirmPopup={setPoolConfirmPopupIsVisible.bind(this, false)}
          rateAB={rateAB}
          rateBA={rateBA}
          lpAmount={
            totalLP < 0.0001 ? totalLP.toFixed(8) : totalLP.toFixed(4)}
        /> }

      { poolAsyncIsWaiting && <WaitingPopup text={`Supplying ${fromValue} ${fromToken.symbol} and ${toValue} ${toToken.symbol}`} /> }
    </div>
  )
}

export default AddLiquidity;
