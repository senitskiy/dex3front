import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import MainBlock from '../../components/MainBlock/MainBlock';
import LiquidityItem from '../../components/LiquidityItem/LiquidityItem';
import './Pool.scss';

function Pool () {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const liquidityList = useSelector(state => state.walletReducer.liquidityList);

  return (
    <div className="container">
      <MainBlock
        class={'pool'}
        title={'Your liquidity'}
        button={
          <Link to="/add-liquidity" className="btn liquidity-btn">Add liquidity</Link>
        }
        content={
          !walletIsConnected ?
            <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button> :
            <div className="pool-wrapper">
              {!liquidityList.length ? 'You don’t have liquidity pairs yet' : liquidityList.map(i => (
                <LiquidityItem
                  symbol={i.symbol}
                  balance={i.balance}
                  key={i.walletAddress}
                />
              ))}
            </div>
        }
      />
    </div>
  )
}

export default Pool;