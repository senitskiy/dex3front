import React from 'react';
import { useDispatch } from 'react-redux';
import { setSwapAsyncIsWaiting } from '../../store/actions/swap';
import { setPoolAsyncIsWaiting } from '../../store/actions/pool';
import Loader from '../Loader/Loader';
import MainBlock from '../MainBlock/MainBlock';
import './WaitingPopup.scss';

function WaitingPopup(props) {
    const dispatch = useDispatch();
  return (
    <MainBlock
      content={
        <div className="popup-content">
          <Loader />
          <p className="popup-loading-text">Waiting for confirmation in your wallet</p>
          { props.text && <p className="popup-loading-text popup-loading-descr">{props.text}</p>}
            <button className="btn popup-btn" onClick={() => {
                dispatch(setSwapAsyncIsWaiting(false))
                dispatch(setPoolAsyncIsWaiting(false))
            }}>Hide</button>
        </div>
      }
    />
  )
}

export default WaitingPopup;
