import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { hidePoolFromSelect, hidePoolToSelect } from '../../store/actions/pool';
import { hideSwapFromSelect, hideSwapToSelect } from '../../store/actions/swap';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import MainBlock from "../MainBlock/MainBlock";
import SearchInput from '../SearchInput/SearchInput';
import SelectItem from '../SelectItem/SelectItem';
import './Select.scss';



function Select(props) {
  const location = useLocation();

  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const pairsList = useSelector(state => state.walletReducer.pairsList);

  const swapFromToken = useSelector(state => state.swapReducer.fromToken);
  const poolFromToken = useSelector(state => state.poolReducer.fromToken);

  const fromToken = location.pathname.includes('swap') ? swapFromToken : poolFromToken;

  const swapToToken = useSelector(state => state.swapReducer.toToken);
  const poolToToken = useSelector(state => state.poolReducer.toToken);

  const toToken = location.pathname.includes('swap') ? swapToToken : poolToToken;

  const [filter, setFilter] = useState('');

  const [fromTokenList, setFromTokenList] = useState([]);
  const [toTokenList, setToTokenList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
    let fromArr = [];

    pairsList.forEach(i => {
      fromArr.push({
        walletAddress: '',
        symbol: i.symbolA,
        balance: 0,
        // fullName:getFullName(i.symbolA)
      })
      fromArr.push({
        walletAddress: '',
        symbol: i.symbolB,
        balance: 0,
        // fullName:getFullName(i.symbolA)
      })
    })

    fromArr = fromArr.filter((i, index, arr) => arr.findIndex(j => (j.symbol === i.symbol)) === index);

    fromArr.forEach((i, index) => {
      tokenList.forEach(j => {
        if(i.symbol === j.symbol) {
          fromArr[index].balance = j.balance;
          fromArr[index].walletAddress = j.walletAddress;
        }
      })
    })

    // setFromTokenList(fromArr);

    let toArr = [];
    if(props.type === 'to') {
      const arr = pairsList.filter(i => i.symbolA === fromToken.symbol || i.symbolB === fromToken.symbol);
      console.log(arr);

      arr.forEach(i => {
        if(fromToken.symbol === i.symbolA) {
          toArr.push({
            pairId: i.pairAddress,
            walletAddress: '',
            symbol: i.symbolB,
            balance: 0,
            // fullName:getFullName(i.symbolA)
          });
        } else if(fromToken.symbol === i.symbolB) {
          toArr.push({
            pairId: i.pairAddress,
            walletAddress: '',
            symbol: i.symbolA,
            balance: 0,
            // fullName:getFullName(i.symbolA)
          });
        }
      })

      toArr.forEach((i, index) => {
        tokenList.forEach(j => {
          if(i.symbol === j.symbol) {
            toArr[index].balance = j.balance;
            toArr[index].walletAddress = j.walletAddress;
          }
        })
      })

      // setToTokenList(toArr);
    }
    // console.log('render select');
    // if(toTokenList.length || fromTokenList.length) { setIsLoading(false); }
  // });

  function handleClose() {
    if(location.pathname.includes('swap')) {
      return props.type === 'from' ? hideSwapFromSelect : hideSwapToSelect
    } else if(location.pathname.includes('add-liquidity')) {
      return props.type === 'from' ? hidePoolFromSelect : hidePoolToSelect
    }
  }

  return ReactDOM.createPortal(
    <div className="select-wrapper">
      <MainBlock
        title={'Select a token'}
        button={<CloseBtn func={handleClose()} />}
        content={
          !pairsList.length ? <Loader /> :
          (<>
            <SearchInput func={setFilter.bind(this)} />
            <div className="select-list">
              { props.type === 'from' && (
                fromArr
                  .sort((a, b) => b.balance - a.balance)
                  .filter(item => item.symbol.toLowerCase().includes(filter.toLowerCase()))
                  .map(item => (
                    <SelectItem
                      type={props.type}
                      walletAddress={item.walletAddress}
                      symbol={item.symbol}
                      balance={item.balance}
                      isActive={fromToken.symbol === item.symbol}
                      fullName={item.fullName}
                      key={item.symbol}
                    />
                ))
              )}
              { props.type === 'to' && (
                toArr
                  .sort((a, b) => b.balance - a.balance)
                  .filter(item => item.symbol.toLowerCase().includes(filter.toLowerCase()))
                  .map(item => (
                    <SelectItem
                      type={props.type}
                      pairId={item.pairId}
                      walletAddress={item.walletAddress}
                      symbol={item.symbol}
                      balance={item.balance}
                      isActive={toToken.symbol === item.symbol}
                      key={item.symbol}
                    />
                ))
              )}
            </div>
          </>)
        }
      />
    </div>,
    document.querySelector('body')
  )
}

export default Select;
