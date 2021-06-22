import React from 'react';
import { useDispatch } from 'react-redux';
import { setSwapAsyncIsWaiting } from '../../store/actions/swap';
import Loader from '../Loader/Loader';
import MainBlock from '../MainBlock/MainBlock';
import './WaitingPopupConnect.scss';

function WaitingPopupConnect(props) {
    const dispatch = useDispatch();
  return (
      // <div className="popup-wrapper">
    <MainBlock
      content={

            <div className="popup-content">
          <Loader />
          <p className="popup-loading-text">Waiting for confirmation in your wallet</p>
          { props.text && <p className="popup-loading-text popup-loading-descr">{props.text}</p>}
            <button className="btn popup-btn" onClick={() => dispatch(setSwapAsyncIsWaiting(false))}>Hide</button>
            </div>

      }
    />
      // </div>
  )
}

export default WaitingPopupConnect;
