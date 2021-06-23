import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {connectWallet, setExtensionsList} from '../../store/actions/app';
import './Wallet.scss'
import {checkExtensions} from "../../extensions/extensions/checkExtensions";

function Wallet() {
  const history = useHistory();
  const dispatch = useDispatch();
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const wallet = useSelector(state => state.walletReducer.wallet);

  const handleClick = async () => {
    dispatch(connectWallet());

    // const extensionsList = await checkExtensions();
    // let checkExt = extensionsList.filter(item=> {
    //   return item.available
    // })
    // if(checkExt.length){    //   dispatch(setExtensionsList(extensionsList));
    // }

    history.push('/account');

  }

  return (
    <div className="wallet">
      {(!walletIsConnected && wallet) ?
        <button className="btn wallet-btn" onClick={handleClick}>Connect wallet</button> :
        <div className="wallet-wrap" onClick={() => history.push('/account')}>
          <span className="wallet-ballance">Gas: {wallet.balance.toFixed(4)} TON</span>
          <span className="wallet-key">{wallet.id.slice(0, 5)}...{wallet.id.slice(-4)}</span>
        </div>
      }
    </div>
  )
}

export default Wallet;
