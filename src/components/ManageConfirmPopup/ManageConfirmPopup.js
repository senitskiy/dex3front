import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MainBlock from '../MainBlock/MainBlock';
import { iconGenerator } from '../../iconGenerator';
import './ManageConfirmPopup.scss';
import { setPoolFromToken, setPoolPairId, setPoolToToken } from '../../store/actions/pool';

function ManageConfirmPopup(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const fromToken = useSelector(state => state.manageReducer.fromToken);
  const toToken = useSelector(state => state.manageReducer.toToken);
  const balance = useSelector(state => state.manageReducer.balance);
  const pairId = useSelector(state => state.manageReducer.pairId);
  const pairS = useSelector(state => state.walletReducer.pairsList);
  let curPair = pairS.filter(item=>item.pairAddress === pairId)
console.log("curPair",curPair)

  const [poolShare, setPoolShare] = useState(1)
  useEffect(()=>{
    let curP = curPair
    let poolS = (balance*100)/(curP && (curP[0].totalSupply ? curP[0].totalSupply : 1)/1000000000)
    setPoolShare(poolS)
  },[pairId])

  // let poolShare = (balance*100)/(curPair && (curPair[0].totalSupply ? curPair[0].totalSupply : 1)/1000000000)
  console.log("poolShare",poolShare)

  const [pooledTokensA, setpooledTokensA] = useState(1)
  const [pooledTokensB, setpooledTokensB] = useState(1)
  useEffect(()=>{
    let curP = curPair
    let pooledTokensA = (curP[0].reserveA/1000000000)*poolShare
    let pooledTokensB = (curP[0].reservetB/1000000000)*poolShare
    setpooledTokensA(pooledTokensA)
    setpooledTokensB(pooledTokensB)
  },[poolShare])

  const handleSupplyClick = () => {

    tokenList.forEach(i => {
      if(i.symbol.includes(fromToken.symbol)) {
        dispatch(setPoolFromToken({
          symbol: i.symbol,
          balance: i.balance
        }))
      } else if(i.symbol.includes(toToken.symbol)) {
        dispatch(setPoolToToken({
          symbol: i.symbol,
          balance: i.balance
        }))
      }
    })

    dispatch(setPoolPairId(pairId))
    history.push("/add-liquidity")
  }

  return (
    <div className="popup-wrapper">
      <MainBlock
        class={'manage-confirm'}
        button={
          <svg onClick={() => history.push("/pool")} className="close" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.6" d="M21.7676 25.272L13 16.507L4.23239 25.272C4.00265 25.5027 3.7296 25.6858 3.42891 25.8108C3.12822 25.9357 2.80582 26 2.48021 26C2.15459 26 1.83219 25.9357 1.5315 25.8108C1.23081 25.6858 0.957759 25.5027 0.728021 25.272C0.497277 25.0422 0.314182 24.7692 0.189248 24.4685C0.0643133 24.1678 0 23.8454 0 23.5198C0 23.1942 0.0643133 22.8718 0.189248 22.5711C0.314182 22.2704 0.497277 21.9973 0.728021 21.7676L9.49296 13L0.728021 4.23239C0.497277 4.00265 0.314182 3.7296 0.189248 3.42891C0.0643133 3.12822 0 2.80582 0 2.48021C0 2.15459 0.0643133 1.83219 0.189248 1.5315C0.314182 1.23081 0.497277 0.957759 0.728021 0.728021C0.957759 0.497277 1.23081 0.314182 1.5315 0.189248C1.83219 0.0643133 2.15459 0 2.48021 0C2.80582 0 3.12822 0.0643133 3.42891 0.189248C3.7296 0.314182 4.00265 0.497277 4.23239 0.728021L13 9.49296L21.7676 0.728021C21.9973 0.497277 22.2704 0.314182 22.5711 0.189248C22.8718 0.0643133 23.1942 0 23.5198 0C23.8454 0 24.1678 0.0643133 24.4685 0.189248C24.7692 0.314182 25.0422 0.497277 25.272 0.728021C25.5027 0.957759 25.6858 1.23081 25.8108 1.5315C25.9357 1.83219 26 2.15459 26 2.48021C26 2.80582 25.9357 3.12822 25.8108 3.42891C25.6858 3.7296 25.5027 4.00265 25.272 4.23239L16.507 13L25.272 21.7676C25.5027 21.9973 25.6858 22.2704 25.8108 22.5711C25.9357 22.8718 26 23.1942 26 23.5198C26 23.8454 25.9357 24.1678 25.8108 24.4685C25.6858 24.7692 25.5027 25.0422 25.272 25.272C25.0422 25.5027 24.7692 25.6858 24.4685 25.8108C24.1678 25.9357 23.8454 26 23.5198 26C23.1942 26 22.8718 25.9357 22.5711 25.8108C22.2704 25.6858 21.9973 25.5027 21.7676 25.272Z" fill="white"/>
          </svg>
        }
        content={
          <>
            <div className="confirm-block">
              <span className="confirm-value">{parseFloat(balance.toFixed(4))}</span>
              <img className="confirm-icon" src={iconGenerator(fromToken.symbol)} alt={fromToken.symbol} />
              <img className="confirm-icon" src={iconGenerator(toToken.symbol)} alt={toToken.symbol} />
              <span className="confirm-token">DS-{fromToken.symbol}/{toToken.symbol} LP Tokens</span>
            </div>
            <button onClick={handleSupplyClick} to={'/add-liquidity'} className="btn popup-btn">Supply</button>
            {balance !== 0 ? <div className="manage-remove-link"><span onClick={() => props.func()}>Remove</span></div> : null}
          </>
        }
        footer={
          <div className="mainblock-footer">
            <div className="mainblock-footer-wrap">
              <div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">{parseFloat(balance.toFixed(4))}</p>
                  <p className="mainblock-footer-subtitle">Your total pool tokens</p>
                </div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">{poolShare.toFixed(4)} %</p>
                  <p className="mainblock-footer-subtitle">Your pool share</p>
                </div>
              </div>
              <div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">{(pooledTokensA/100).toFixed(4)}</p>
                  <p className="mainblock-footer-subtitle">Your pooled {fromToken.symbol}</p>
                </div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">{(pooledTokensB/100).toFixed(4)}</p>
                  <p className="mainblock-footer-subtitle">Your pooled {toToken.symbol}</p>
                </div>

              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default ManageConfirmPopup;
